// ●Hands - mediapipe https://google.github.io/mediapipe/solutions/hands.html
/* jshint esversion: 8 */
let video;
let LMsArray = [];
let trajectory = [];

const videoElement = document.getElementsByClassName("input_video")[0];
videoElement.style.display = "none";

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

hands.setOptions({
  maxNumHands: 4, 
  modelComplexity: 1,
  minDetectionConfidence: 0.9,
  minTrackingConfidence: 0.9,
});

let getPoses = (results) => {
  LMsArray = results.multiHandLandmarks;
}
hands.onResults(getPoses);

const camera0 = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480,
});
camera0.start();

const colorList = [
  [255, 0, 0], //赤
  [255, 128, 0], //橙
  [255, 255, 0], //黄
  [0, 255, 0], //緑
  [0, 255, 255], //水
  [0, 0, 255], //青
  [128, 0, 255], //紫
  [255, 255, 255], //白
  [0, 0, 0], //黒
  [128, 128, 128], //灰
  [128, 255, 0], //黄緑
  [255, 128, 255], //桃
  [128, 64, 0] //茶
];
const rainbow = colorList.slice(0, 8);

let hand_obj = {
  'thumb': {'name': '親指'},
  'indexFinger': {'name': '人指し指'},
  'middleFinger': {'name': '中指'},
  'ringFinger': {'name': '薬指'},
  'pinky': {'name': '小指'},
  'palmBase': {'name': '手の平'}
};
let parts = Object.keys(hand_obj);
let screen = 0;
let currentPart;
let previousPart;

const rippleNumber = 10;
const frameNumber = 30;
const halfFrameNumber = frameNumber / 2;
const shortFrameNumber = frameNumber / 3;
const longFrameNumber = halfFrameNumber * 3;
const colorNumber = rainbow.length;
const ripple_obj_init = {
  flag: false, 
  drawRipple: function(maxIndex) {} 
};
let ripples = [];
for(let i = 0; i < rippleNumber; i++){
  ripples[i] = ripple_obj_init;
}
let specialRipple = [];
for(let i = 0; i < colorNumber; i++){
  specialRipple[i] = ripple_obj_init;
}
let specialRippleFlag = false;
let clearing = ripple_obj_init;
let Ncount = 0;
let Scount = 0;
let centerX, centerY;

class RippleClass{
  constructor(){
    this.flag = true;
    this.index = 0;
    this.maxIndex = frameNumber;
    this.video = [];
  }
  assign(X, Y, col, func) {
    let ripple = [];
    for(let i = 0; i < this.maxIndex; i++){
      ripple[i] = func(X, Y, col, i);
    }
    return ripple;
  }
  drawRipple() {
    if(this.flag){
      this.video[this.index]();
      this.index++;
      if(this.index >= this.maxIndex){
        this.flag = false;
      }
    }
  }
}

class NormalRippleClass extends RippleClass{
  constructor(X, Y, col){
    super();
    this.video = this.setRipple(X, Y, col);
  }
  setRipple(X, Y, col) {
    let createRipple = (X, Y, col, i) => {
      return () => {
        let alphaValue = 255 * (1 - i / this.maxIndex);
        noStroke();
        fill(col[0], col[1], col[2], alphaValue);
        ellipse(X, Y, 6 * (1 + i));
      }
    }
    
    return this.assign(X, Y, col, createRipple);
  }
}

class SpecialRippleClass extends RippleClass{
  constructor(X, Y, col){
    super();
    this.maxIndex = halfFrameNumber;
    this.video = this.setRipple(X, Y, col);
  }
  setRipple(X, Y, col) {
    let createRipple = (X, Y, col, i) => {
      return () => {
        noStroke();
        fill(col);
        ellipse(X, Y, 104 * (1 + i));
      }
    }
    
    return this.assign(X, Y, col, createRipple);
  }
}

class ClearClass extends RippleClass{
  constructor(){
    super();
    this.flag = false;
    this.maxIndex = longFrameNumber;
    this.video = this.setRipple();
  }
  setRipple() {
    let createRipple = (X, Y, col, i) => {
      return () => {
        let alphaValue = 255 * (1 - i / this.maxIndex);
        noStroke();
        fill(255, 255, 255, alphaValue);
        rect(0, 0, width, height);
      }
    }
    
    return this.assign(0, 0, 255, createRipple);
  }
}

function mouseClicked() {
  if(screen == 1 && !specialRippleFlag && !clearing.flag){
    centerX = mouseX;
    centerY = mouseY;
    if(random() < 0.01){
      Scount = 0;
      specialRippleFlag = true;
    } else{
      let col = random(colorList);
      ripples[Ncount] = new NormalRippleClass(centerX, centerY, col);
      Ncount++;
      if(Ncount >= rippleNumber){
        Ncount = 0;
      }
    }
  }
}

function partInit(part) {
  switch (part) {
  case 'thumb':
    hand_obj[part].col = colorList[0];
    break;
  case 'indexFinger':
    hand_obj[part].col = colorList[6];
    break;
  case 'middleFinger':
    hand_obj[part].col = colorList[5];
    break;
  case 'ringFinger':
    hand_obj[part].col = colorList[3];
    break;
  case 'pinky':
    hand_obj[part].col = colorList[2];
    break;
  case 'palmBase':
    hand_obj[part].col = colorList[9];
    break;
  }
}

function colorInit() {
  for (let part of parts) {
    partInit(part);
  }
}

function setAnnotation(positions, ...indexes) {
  let annotation = [];
  for(let index of indexes){
    annotation.push(positions[index]);
  }
  return annotation;
}

let button_obj = {
  'buttons': [],
  'previousScreen': 0,
  'setButton': function(name, posX, posY, func) {
    let button = createButton(name);
    button.style('width', '100px');
    button.style('height', '40px');
    button.style('font-size', '20px');
    button.position(posX, posY); 
    button.mouseClicked(func);
    button.hide();
    return button;
  },
  'buttonShow': function(screen) {
    if(this.previousScreen != screen){
      let obj = this.buttons[this.previousScreen];
      for (let btn of obj) {
        btn.hide();
      }
      obj = this.buttons[screen];
      for (let btn of obj) {
        btn.show();
      }
      this.previousScreen = screen;
    }
  }
};

function setup() {
  let backButton;
  let initButton;
  let Y = 40;
  let partSetting = (part) => {
    return () => {
      screen = 3;
      currentPart = part;
    }
  };
  
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  screen = 1;
  frameRate(frameNumber);
  colorInit();
  clearing = new ClearClass();
  
  button_obj.buttons[0] = [];
  button_obj.buttons[1] = [
    button_obj.setButton("設定", 10, 430, () => {screen = 2})
  ];
  button_obj.buttons[2] = [
    backButton = button_obj.setButton("戻る", 10, 430, () => {screen--}),
    initButton = button_obj.setButton("初期化", 530, 430, colorInit)
  ];
  for(let part of parts){
    let button = button_obj.setButton(hand_obj[part].name, 100, Y, partSetting(part));
    button_obj.buttons[2].push(button);
    Y += 60;
  }
  button_obj.buttons[3] = [
    backButton, initButton
  ];
}

function draw() {
  background(0);
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  
  let oneHandPoses = [];
  let setAnnotation = (positions, ...indexes) => {
    let annotation = [];
    for(let index of indexes){
      annotation.push(positions[index]);
    }
    return annotation;
  }
  for (let i in LMsArray) {
    let positions = [];
    for (let j = 0; j < 21; j++) {
      let posX = width * LMsArray[i][j].x;
      let posY = height * LMsArray[i][j].y;
      stroke(255);
      fill(255, 100);
      ellipse(posX, posY, 24);
      positions[j] = {x: posX, y: posY};
    }
    
    let annotations = {};
    annotations.thumb = setAnnotation(positions, 1, 2, 3, 4);
    annotations.indexFinger = setAnnotation(positions, 5, 6, 7, 8);
    annotations.middleFinger = setAnnotation(positions, 9, 10, 11, 12);
    annotations.ringFinger = setAnnotation(positions, 13, 14, 15, 16);
    annotations.pinky = setAnnotation(positions, 17, 18, 19, 20);
    annotations.palmBase = setAnnotation(positions, 0, 1, 5, 9, 13, 17, 0);
    oneHandPoses[i] = annotations;
  }
  if(trajectory.length >= shortFrameNumber){
    trajectory.shift();
  }
  trajectory.push(oneHandPoses);
  for(let i in trajectory){
    let oneHandPoses = trajectory[i];
    let alphaValue = (1 + Number(i)) * 255 / shortFrameNumber;
    for(let annotations of oneHandPoses){
      for (let part of parts) {
        let col = hand_obj[part].col;
        beginShape();
        for (let position of annotations[part]) { 
          stroke(col[0], col[1], col[2], alphaValue);
          strokeWeight(8);
          noFill();
          vertex(position.x, position.y);
        }
        endShape();
      }
    }
  }
  
  translate(width, 0);
  scale(-1, 1);
  for(let i = 0; i < rippleNumber; i++){
    ripples[i].drawRipple();
  }
  if(specialRippleFlag){
    if(Scount < colorNumber){
      let col = rainbow[Scount];
      specialRipple[Scount] = new SpecialRippleClass(centerX, centerY ,col);
      Scount++;
    }
    for(let i = 0; i < colorNumber; i++){
      specialRipple[i].drawRipple();
    }
    if (specialRipple.every(obj => obj.flag == false)) {
      specialRippleFlag = false;
      clearing.flag = true;
    }
    if(clearing.index >= longFrameNumber){
      clearing.index = 0;
    }
  } 
  clearing.drawRipple();
  
  button_obj.buttonShow(screen);
  if(screen >= 2){ 
    noStroke();
    fill(128,128,128,180);
    rect(0, 0, width, height);
    
    let drawRect = (X, Y, col) => {
      stroke(0);
      strokeWeight(1);
      fill(col);
      rect(X, Y, 38, 38);
    };
    if(screen == 2){
      let X = 221;
      let Y = 41;
      for (let part of parts) {
        drawRect(X, Y, hand_obj[part].col);
        Y += 60;
      }
    } else if(screen == 3){
      if(currentPart != previousPart){
        button_obj.buttons[3][1].mouseClicked(() => {partInit(currentPart)});
        previousPart = currentPart;
      }
      stroke(0);
      strokeWeight(3);
      fill(255);
      textSize(52);
      text(hand_obj[currentPart].name, 20, 70);
    }
  }
}

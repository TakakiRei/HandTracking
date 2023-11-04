/* jshint esversion: 8 */
let video;
let landmarksArray = [];
let trajectory = [];
let trajectoryFlag = true;

const videoElement = document.getElementsByClassName("input_video")[0];
videoElement.style.display = "none";

const hands = new Hands({
  locateFile: (file) => {
    screen = 1;
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

hands.setOptions({
  maxNumHands: 4, 
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

let getPoses = (results) => {
  landmarksArray = results.multiHandLandmarks;
  //console.log(landmarksArray[0][8].z);
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

const SRprobability = 0.01;
const MCprobability = 0.05;
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

let handObj = {
  'thumb': {
    'name': '<ruby>親指<rt>おやゆび</rt></ruby>',
    'drawLine': function() {
      line(410, 270, 490, 360);
    }
  },
  'indexFinger': {
    'name': '<ruby>人<rt>ひと</rt>指<rt>さ</rt></ruby>し<ruby>指<rt>ゆび</rt></ruby>',
    'drawLine': function() {
      line(480, 170, 490, 270);
    }
  },
  'middleFinger': {
    'name': '<ruby>中指<rt>なかゆび</rt></ruby>',
    'drawLine': function() {
      line(520, 160, 520, 270);
    }
  },
  'ringFinger': {
    'name': '<ruby>薬<rt>くすり</rt>指<rt>ゆび</rt></ruby>',
    'drawLine': function() {
      line(555, 180, 545, 275);
    }
  },
  'pinky': {
    'name': '<ruby>小<rt>こ</rt>指<rt>ゆび</rt></ruby>',
    'drawLine': function() {
      line(590, 220, 570, 285);
    }
  },
  'palmBase': {
    'name': '<ruby>手<rt>て</rt></ruby>の<ruby>平<rt>ひら</rt></ruby>/<ruby>甲<rt>こう</rt></ruby>',
    'drawLine': function() {
      line(490, 270, 570, 285);
      line(570, 285, 520, 370);
      line(520, 370, 490, 360);
      line(490, 360, 490, 270);
    }
  }
};
let joint = {
  'name': '<ruby>関節<rt>かんせつ</rt></ruby>',
  'drawJoint': function() {
    line(410, 270, 490, 360);
  }
}
let parts = Object.keys(handObj);
let screen = 0;
let currentPart;
let previousPart;
let img;

const rippleNumber = 10;
const frameNumber = 30;
const halfFrameNumber = frameNumber / 2;
const shortFrameNumber = frameNumber / 3;
const longFrameNumber = halfFrameNumber * 3;
const colorNumber = rainbow.length;
const rippleObjInit = {
  flag: false, 
  drawRipple: function(maxIndex) {} 
};
let ripples = new Array(rippleNumber).fill(rippleObjInit);
let specialRipple = new Array(colorNumber).fill(rippleObjInit);
let specialRippleFlag = false;
let clearing = rippleObjInit;
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
    if(random() < SRprobability){
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
  let col = [];
  switch (part) {
  case 'thumb':
    col = colorList[0];
    break;
  case 'indexFinger':
    col = colorList[6];
    break;
  case 'middleFinger':
    col = colorList[5];
    break;
  case 'ringFinger':
    col = colorList[3];
    break;
  case 'pinky':
    col = colorList[2];
    break;
  case 'palmBase':
    col = colorList[9];
    break;
  }
  handObj[part].col = col;
  if(screen3Obj.setFlag){  
    let sliders = screen3Obj[part].sliders;
    sliders[0].value(col[0]);
    sliders[1].value(col[1]);
    sliders[2].value(col[2]);
  }
}

function jointInit() {
  let col = colorList[7];
  joint.col = col;
  if(screen4Obj.setFlag){  
    let sliders = joint.sliders;
    sliders[0].value(col[0]);
    sliders[1].value(col[1]);
    sliders[2].value(col[2]);
  }
}

function init() {
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

let buttonObj = {
  'buttons': [],
  'previousScreen': 0,
  'setButton': function(name, w, posX, posY, func) {
    let button = createButton(name);
    button.style('width', w + 'px');
    button.addClass("myButtonStyle");
    button.position(posX, posY); 
    button.mouseClicked(func);
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

class SetObjectClass{
  constructor(part){
    this.name = createElement('font', part.name);
    this.name.addClass("myFontStyle");
    this.name.position(20, 10);
    this.sliders = [];
    for(let i = 0; i < 3; i++){
      let slider = createSlider(0, 255, part.col[i]);
      slider.addClass("mySliderStyle");
      slider.position(80, 200 + 60 * i);
      this.sliders[i] = slider;
    }
  }
}

class Screen3ObjClass{
  constructor(){
    this.setFlag = false;
    this.hideFlag = false;
    for(let part of parts){
      this[part] = {};
    }
  }
  hide() {
    if(this.hideFlag){
      let object = this[currentPart];
      this.hide1(object);
      this.hideFlag = false;
    }
  }
  show() {
    if(!this.hideFlag){
      let object = this[currentPart];
      this.show1(object);
      this.hideFlag = true;
    }
  }
  hide1(object) {
    object.name.hide();
    object.sliders[0].hide();
    object.sliders[1].hide();
    object.sliders[2].hide();
  }
  show1(object) {
    object.name.show();
    object.sliders[0].show();
    object.sliders[1].show();
    object.sliders[2].show();
  }
}

class Screen4ObjClass extends Screen3ObjClass{
  constructor(){
    super();
    for(let part of parts){
      delete this[part];
    }
    this.joint = new SetObjectClass();
  }
  hide() {
    if(this.hideFlag){
      let object = this.joint;
      this.hide1(object);
      this.hide2(object);
      this.hideFlag = false;
    }
  }
  show() {
    if(!this.hideFlag){
      let object = this.joint;
      this.show1(object);
      this.hide2(object);
      this.hideFlag = true;
    }
  }
  hide2(object) {
    
  }
  show2(object) {
    
  }
}

let screen3Obj = new Screen3ObjClass();

function trajectorySwitching() {
  if(trajectoryFlag){
    buttonObj.buttons[2][3].html("<ruby>軌<rt>き</rt>跡<rt>せき</rt></ruby>あり");
  } else{
    buttonObj.buttons[2][3].html("<ruby>軌<rt>き</rt>跡<rt>せき</rt></ruby>なし");
  }
  trajectoryFlag = !trajectoryFlag;
}

function drawPoses(oneHandPoses, alphaValue) {
  for(let annotations of oneHandPoses){
    for (let part of parts) {
      let col = handObj[part].col;
      stroke(col[0], col[1], col[2], alphaValue);
      beginShape();
      for (let position of annotations[part]) { 
        vertex(position.x, position.y);
      }
      endShape();
    }
  }
}

function preload() {
  img = loadImage('./assets/hand.png');
}

function setup() {
  let backButton;
  let Y = 60;
  let partSetting = (part) => {
    return () => {
      screen = 3;
      currentPart = part;
    }
  };
   
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  frameRate(frameNumber);
  init();
  screen3Obj.setFlag = true;
  clearing = new ClearClass();
  
  buttonObj.buttons[0] = [];
  buttonObj.buttons[1] = [
    buttonObj.setButton("<ruby>設定<rt>せってい</rt></ruby>", 80, 10, 430, () => {screen = 2})
  ];
  buttonObj.buttons[2] = [
    backButton = buttonObj.setButton("<ruby>戻<rt>もど</rt></ruby>る", 80, 10, 430, () => {screen--}),
    buttonObj.setButton("リセット", 100, 530, 430, init),
    buttonObj.setButton("<ruby>関節<rt>かんせつ</rt></ruby>", 110, 120, 300, ()=>{}),
    buttonObj.setButton("<ruby>軌<rt>き</rt>跡<rt>せき</rt></ruby>なし", 110, 350, 300, trajectorySwitching)
  ];
  buttonObj.buttons[3] = [
    backButton, 
    buttonObj.setButton("リセット", 100, 530, 430, () => {})
  ];
  
  for(let i in parts){
    let part = parts[i];
    let bool = i % 2;
    let button = buttonObj.setButton(handObj[part].name, 110, 120 + bool * 230, Y, partSetting(part));
    buttonObj.buttons[2].push(button);
    Y += 80 * bool;
    screen3Obj[part] = new SetObjectClass();
  }
}

function draw() {
  background(0);
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  
  let landmarks = [];
  let oneHandPoses = [];
  
  for (let i in landmarksArray) {
    let positions = [];
    for (let j = 0; j < 21; j++) {
      let posX = width * landmarksArray[i][j].x;
      let posY = height * landmarksArray[i][j].y;
      positions[j] = {x: posX, y: posY};
    }
    landmarks = landmarks.concat(positions);
    
    let annotations = {};
    annotations.thumb = setAnnotation(positions, 1, 2, 3, 4);
    annotations.indexFinger = setAnnotation(positions, 5, 6, 7, 8);
    annotations.middleFinger = setAnnotation(positions, 9, 10, 11, 12);
    annotations.ringFinger = setAnnotation(positions, 13, 14, 15, 16);
    annotations.pinky = setAnnotation(positions, 17, 18, 19, 20);
    annotations.palmBase = setAnnotation(positions, 0, 1, 5, 9, 13, 17, 0);
    oneHandPoses[i] = annotations;
  }
  
  strokeWeight(8);
  noFill();
  if(trajectoryFlag){
    if(trajectory.length >= shortFrameNumber){
      trajectory.shift();
    }
    trajectory.push(oneHandPoses);
  
    for(let i in trajectory){
      let oneHandPoses = trajectory[i];
      let alphaValue = (1 + Number(i)) * 255 / shortFrameNumber;
      drawPoses(oneHandPoses, alphaValue);
    }
  } else{
    drawPoses(oneHandPoses, 255);
  }
  
  stroke(255);
  fill(255, 100);
  for (let position of landmarks) {
    ellipse(position.x, position.y, 24);
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
  
  buttonObj.buttonShow(screen);
  if(screen >= 2){ 
    screen3Obj.hide();
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
      let Y = 61;
      for (let i in parts) {
        let part = parts[i];
        let bool = i % 2;
        X = 251 + bool * 230;
        drawRect(X, Y, handObj[part].col);
        Y += 80 * bool;
      }
    } else if(screen == 3){
      if(currentPart != previousPart){
        buttonObj.buttons[3][1].mouseClicked(() => {partInit(currentPart)});
        previousPart = currentPart;
      }
      
      screen3Obj.show();
      let sliders = screen3Obj[currentPart].sliders;
      let R = sliders[0].value();
      let G = sliders[1].value();
      let B = sliders[2].value();
      let col = [R, G, B]
      
      stroke(0);
      strokeWeight(1);
      textSize(40);
      fill(255, 0, 0);
      text('R', 40, 232);
      fill(0, 255, 0);
      text('G', 40, 292);
      fill(0, 0, 255);
      text('B', 40, 352);
      
      image(img, 400, 150);
      stroke(col);
      strokeWeight(12);
      handObj[currentPart].drawLine();
      handObj[currentPart].col = col;
    }
  }
}

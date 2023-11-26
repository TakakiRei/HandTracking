const rainbowProb = 0.01;

const colorNumber = 8;
const rainbow = colorList.slice(0, colorNumber);

const rippleNumber = 10;
const rippleObjInit = {
  flag: false, 
  drawRipple: function(maxIndex) {} 
};

let ripples = new Array(rippleNumber).fill(rippleObjInit);
let specialRipple = new Array(colorNumber).fill(rippleObjInit);
specialRipple.flag = false;

let NormalCount = 0;
let SpecialCount = 0;
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
    const createRipple = (X, Y, col, i) => {
      return () => {
        const alphaValue = 255 * (1 - i / this.maxIndex);
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
    const createRipple = (X, Y, col, i) => {
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
    const createRipple = (X, Y, col, i) => {
      return () => {
        const alphaValue = 255 * (1 - i / this.maxIndex);
        noStroke();
        fill(255, 255, 255, alphaValue);
        rect(0, 0, width, height);
      }
    }
    
    return this.assign(0, 0, 255, createRipple);
  }
}

const clearing = new ClearClass();

function mouseClicked() {
  if(screen == 1 && !specialRipple.flag && !clearing.flag){
    centerX = mouseX;
    centerY = mouseY;
    if(random() < rainbowProb){
      SpecialCount = 0;
      specialRipple.flag = true;
    } else{
      const col = random(colorList);
      ripples[NormalCount] = new NormalRippleClass(centerX, centerY, col);
      NormalCount++;
      if(NormalCount >= rippleNumber){
        NormalCount = 0;
      }
    }
  }
}

function drawRipples() {
  for(let i = 0; i < rippleNumber; i++){
    ripples[i].drawRipple();
  }
  if(specialRipple.flag){
    if(SpecialCount < colorNumber){
      let col = rainbow[SpecialCount];
      specialRipple[SpecialCount] = new SpecialRippleClass(centerX, centerY ,col);
      SpecialCount++;
    }
    for(let i = 0; i < colorNumber; i++){
      specialRipple[i].drawRipple();
    }
    if (specialRipple.every(obj => obj.flag == false)) {
      specialRipple.flag = false;
      clearing.flag = true;
    }
    if(clearing.index >= longFrameNumber){
      clearing.index = 0;
    }
  } 
  clearing.drawRipple();
}


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
const canvasWidth = 640;
const canvasHeight = 480;
const sldPosX = 30;
const sldPosY = 210;
const sldDeltaY = 60;
const btnPosX = 120;
const btnWidth = 110;
const btnDeltaX = btnPosX + btnWidth;
const btnHeight = 40;
const btnPosY = 60;
const btnDeltaY = 80;
const specialbtnPosY = 140;
const fontSize = 40;

const frameNumber = 30;
const halfFrameNumber = frameNumber / 2;
const shortFrameNumber = frameNumber / 3;
const longFrameNumber = halfFrameNumber * 3;

let screen = 0;
let currentPart;

let landmarksArray = [];
let trajectory = [];
let trajectoryFlag = true;

let handImg;
let flowerImg;
let botabonImg;

let handObj = {
  thumb: {
    initCol: colorList[0],
    col: colorList[0],
    label: "<ruby>親指<rt>おやゆび</rt></ruby>",
    drawLine: function () {
      line(410, 270, 490, 360);
    },
  },
  indexFinger: {
    initCol: colorList[6],
    col: colorList[6],
    label: "<ruby>人<rt>ひと</rt>指<rt>さ</rt></ruby>し<ruby>指<rt>ゆび</rt></ruby>",
    drawLine: function () {
      line(480, 170, 490, 270);
    },
  },
  middleFinger: {
    initCol: colorList[5],
    col: colorList[5],
    label: "<ruby>中指<rt>なかゆび</rt></ruby>",
    drawLine: function () {
      line(520, 160, 520, 270);
    },
  },
  ringFinger: {
    initCol: colorList[3],
    col: colorList[3],
    label: "<ruby>薬<rt>くすり</rt>指<rt>ゆび</rt></ruby>",
    drawLine: function () {
      line(555, 180, 545, 275);
    },
  },
  pinky: {
    initCol: colorList[2],
    col: colorList[2],
    label: "<ruby>小<rt>こ</rt>指<rt>ゆび</rt></ruby>",
    drawLine: function () {
      line(590, 220, 570, 285);
    },
  },
  palmBase: {
    initCol: colorList[9],
    col: colorList[9],
    label: "<ruby>手<rt>て</rt></ruby>の<ruby>平<rt>ひら</rt></ruby>/<ruby>甲<rt>こう</rt></ruby>",
    drawLine: function () {
      line(490, 270, 570, 285);
      line(570, 285, 520, 370);
      line(520, 370, 490, 360);
      line(490, 360, 490, 270);
    },
  }
};
let joint = {
  initCol: colorList[7],
  col: colorList[7],
  label: "<ruby>関節<rt>かんせつ</rt></ruby>",
  shape: 0,
  weight: 8,
  drawJoint: function (x, y, w) {
    let col = this.col;
    let hw = w / 2;
    strokeWeight(this.weight);
    stroke(col);
    fill(col[0], col[1], col[2], 100);
    switch (this.shape) {
      case 0:
        ellipse(x, y, w);
        break;
      case 1:
        rect(x - hw, y - hw, w, w);
        break;
      case 2:
        triangle(x, y - hw, x - hw, y + hw, x + hw, y + hw);
        break;
      case 3:
        noFill();
        line(x - hw, y - hw, x + hw, y + hw);
        line(x + hw, y - hw, x - hw, y + hw);
        break;
    }
  },
};
const parts = Object.keys(handObj);

function partInit(part) {
  const col = handObj[part].initCol;
  handObj[part].col = col;
  if (screen3Obj) {
    let handPart = screen3Obj[part];
    handPart.changeColor(col)();
  }
}

function jointInit() {
  const col = joint.initCol;
  joint.col = col;
  if (screen4Obj) {
    let joint = screen4Obj.joint;
    joint.changeShape(0)();
    joint.changeColor(col)();
  }
}

function preload() {
  handImg = loadImage('./assets/hand.png');
}

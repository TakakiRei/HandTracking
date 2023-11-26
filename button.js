const trajectoryLabel = "<ruby>軌<rt>き</rt>跡<rt>せき</rt></ruby>";
const onLabel = trajectoryLabel + "あり";
const offLabel = trajectoryLabel + "なし";

let resetButton;
let switchButton;

let buttonObj = {
  buttons: [[], [], [], [], []],
  pScreen: 0,
  setButton: function (screen, label, posX, posY, w, func) {
    let button = createButton(label);
    button.addClass("myButtonStyle");
    button.position(posX, posY);
    button.style("width", w + "px");
    button.mouseClicked(func);
    this.buttons[screen].push(button);
    return button;
  },
  buttonShow: function (screen) {
    if (this.pScreen != screen) {
      let obj = this.buttons[this.pScreen];
      for (let btn of obj) {
        btn.hide();
      }
      obj = this.buttons[screen];
      for (let btn of obj) {
        btn.show();
      }
      this.pScreen = screen;
    }
  },
};

function init() {
  for (let part of parts) {
    partInit(part);
  }
  jointInit();
  trajectoryFlag = false;
  trajectorySwitching();
}

function trajectorySwitching() {
  if (trajectoryFlag) {
    switchButton.html(onLabel);
  } else {
    switchButton.html(offLabel);
  }
  trajectoryFlag = !trajectoryFlag;
}

function partSetting(part) {
  return () => {
    screen = 3;
    if (part != currentPart) {
      resetButton.mouseClicked(() => {partInit(part);});
      currentPart = part;
    }
  };
}

function setButtons(){
  const leftBtnPosX = 10;
  const leftBtnwidth = 80;
  const rightBtnPosX = 530;
  const rightBtnwidth = 100;
  const bottomBtnPosY = 430;
  let backButton;
  
  buttonObj.setButton(1, "<ruby>設定<rt>せってい</rt></ruby>", leftBtnPosX, bottomBtnPosY, leftBtnwidth, () => {screen = 2;});
  backButton = buttonObj.setButton(2, "<ruby>戻<rt>もど</rt></ruby>る", leftBtnPosX, bottomBtnPosY, leftBtnwidth, () => {screen--;});
  buttonObj.setButton(2, "リセット", rightBtnPosX, bottomBtnPosY, rightBtnwidth, init);
  buttonObj.buttons[3].push(backButton);
  resetButton = buttonObj.setButton(3, "リセット", rightBtnPosX, bottomBtnPosY, rightBtnwidth, () => {});
  buttonObj.setButton(4, "<ruby>戻<rt>もど</rt></ruby>る", leftBtnPosX, bottomBtnPosY, leftBtnwidth, () => {screen = 2;});
  buttonObj.setButton(4, "リセット", rightBtnPosX, bottomBtnPosY, rightBtnwidth, jointInit);
  
  let posY = btnPosY;
  for (let i in parts) {
    let part = parts[i];
    let bool = i % 2;
    let posX = btnPosX + btnDeltaX * bool;
    buttonObj.setButton(2, handObj[part].label, posX, posY, btnWidth, partSetting(part));
    posY += btnDeltaY * bool;
  }
  buttonObj.setButton(2, joint.label, btnPosX, posY, btnWidth, () => {screen = 4;});
  switchButton = buttonObj.setButton(2, offLabel, btnPosX + btnDeltaX, posY, btnWidth, trajectorySwitching);
}

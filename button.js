const trajectoryLabel = "<ruby>軌<rt>き</rt>跡<rt>せき</rt></ruby>";
const onLabel = trajectoryLabel + "あり";
const offLabel = trajectoryLabel + "なし";

let resetButton;
let switchButton;

let buttonObj = {
  buttons: [[], [], [], [], []],
  previousScreen: 0,
  setButton: function (screen, label, w, posX, posY, func) {
    let button = createButton(label);
    button.style("width", w + "px");
    button.addClass("myButtonStyle");
    button.position(posX, posY);
    button.mouseClicked(func);
    this.buttons[screen].push(button);
    return button;
  },
  buttonShow: function (screen) {
    if (this.previousScreen != screen) {
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
  let backButton;
  
  buttonObj.setButton(1, "<ruby>設定<rt>せってい</rt></ruby>", 80, 10, 430, () => {screen = 2;});
  backButton = buttonObj.setButton(2, "<ruby>戻<rt>もど</rt></ruby>る", 80, 10, 430, () => {screen--;});
  buttonObj.setButton(2, "リセット", 100, 530, 430, init);
  buttonObj.setButton(2, joint.label, 110, 120, 300, () => {screen = 4;});
  switchButton = buttonObj.setButton(2, offLabel, 110, 350, 300, trajectorySwitching);
  buttonObj.buttons[3].push(backButton);
  resetButton = buttonObj.setButton(3, "リセット", 100, 530, 430, () => {});
  buttonObj.setButton(4, "<ruby>戻<rt>もど</rt></ruby>る", 80, 10, 430, () => {screen = 2;});
  buttonObj.setButton(4, "リセット", 100, 530, 430, jointInit);
  
  let Y = btnPosY;
  for (let i in parts) {
    let part = parts[i];
    let bool = i % 2;
    let X = btnPosX + btnDeltaX * bool;
    buttonObj.setButton(2, handObj[part].label, btnWidth, X, Y, partSetting(part));
    Y += btnDeltaY * bool;
  }
}

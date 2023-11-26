class SetObjectClass {
  constructor(part) {
    const l = 180;

    this.btnNumber = 4;
    const leftBtnPosX = sldPosX;
    const shiftBtnWidth = 30;
    const btnSize = btnHeight;
    const edgeBtnSpace = 10;
    const middleBtnSpace = 20;
    const rightBtnPosX = leftBtnPosX + shiftBtnWidth + btnSize * this.btnNumber + middleBtnSpace * (this.btnNumber - 1) + edgeBtnSpace * 2;
    const posY = specialbtnPosY;

    this.isPressedColor = this.specifyRGB([l, l, l]);
    this.shownColorIndex = 0;
    this.selectedColorIndex = this.identifyIndex(part.col);
    this.pDeltaIndex = -1;

    this.label = this.setLabel(part, 20, 10);
    this.sliders = this.setSliders(part);
    this.colorButtons = this.setColorButtons(leftBtnPosX + shiftBtnWidth + edgeBtnSpace, posY, btnSize, middleBtnSpace);
    this.leftButton = this.setShiftButton("◀", leftBtnPosX, posY, shiftBtnWidth, -1);
    this.rightButton = this.setShiftButton("▶", rightBtnPosX, posY, shiftBtnWidth, 1);  
    this.shiftColor(0)();
  }
  specifyRGB(col) {
    const R = col[0];
    const G = col[1];
    const B = col[2];
    return "rgb(" + R + "," + G + "," + B + ")";
  }
  identifyIndex(col){
    for (let i in colorList) {
      let j;
      for (j = 0; j < 3; j++) {
        if(colorList[i][j] != col[j]){
          break;
        }
      }
      if(j == 3){
        return i;
      }
    }
    return -1;
  }
  setLabel(part, posX, posY){
    let label = createElement("font", part.label);
    label.addClass("myFontStyle");
    label.position(posX, posY);
    return label;
  }
  setColorButtons(posX0, posY, size, space) {
    let posX = posX0;
    let buttons = [];
    for (let i = 0; i < this.btnNumber; i++) {
      let button = createButton('');
      button.addClass("myButtonStyle");
      button.position(posX, posY);
      posX += size + space;
      buttons[i] = button;
    }
    return buttons;
  }
  setSliders(part) {
    const posX = sldPosX + fontSize;
    let sliders = [];
    for (let i = 0; i < 3; i++) {
      const posY = sldPosY + sldDeltaY * i;
      let slider = createSlider(0, 255, part.col[i]);
      slider.addClass("mySliderStyle");
      slider.position(posX, posY);
      sliders[i] = slider;
    }
    return sliders;
  }
  changeBorder(){
    const deltaIndex = this.selectedColorIndex - this.shownColorIndex;
    const drawBorder = (deltaIndex, w, col) => {
      if(deltaIndex >= 0 && deltaIndex < this.btnNumber){
        let button = this.colorButtons[deltaIndex];
        button.style("border", w + "px solid " + col);
      }
    }

    if(this.pDeltaIndex != deltaIndex){
      drawBorder(deltaIndex, 4, "white");
      drawBorder(this.pDeltaIndex, 1, "black");
      this.pDeltaIndex = deltaIndex;
    }
  }
  changeColor(col){
    return () => {
      for (let i in this.sliders) {
        this.sliders[i].value(col[i]);
      }
      this.selectedColorIndex = this.identifyIndex(col);
      this.changeBorder();
    }
  }
  shiftColor(step){
    return () => {
      const maxIndex = colorList.length - this.btnNumber;
      let index = this.shownColorIndex + step;
      if(index <= 0){
        index = 0;
        this.leftButton.style("background-color", this.isPressedColor);
      } else if(index >= maxIndex){
        index = maxIndex;
        this.rightButton.style("background-color", this.isPressedColor);
      } else {
        this.leftButton.style("background-color", "white");
        this.rightButton.style("background-color", "white");
      }

      if(!(this.shownColorIndex == index && step)){
        for (let i in this.colorButtons) {
          let col = colorList[index + Number(i)];
          let button = this.colorButtons[i];
          button.style("background-color", this.specifyRGB(col));
          button.mouseClicked(this.changeColor(col));
        }
        this.shownColorIndex = index;
        this.changeBorder();
      }
    }
  }
  setShiftButton(label, posX, posY, w, step) {
    let button = createButton(label);
    button.addClass("myButtonStyle2");
    button.position(posX, posY);
    button.style("width", w + "px");
    button.mouseClicked(this.shiftColor(step));
    return button;
  }
}

class Screen3ObjClass {
  constructor() {
    this.flag = false;
  }
  hide(part) {
    if (this.flag) {
      let object = this[part];
      this.hide1(object);
      this.flag = false;
    }
  }
  show(part) {
    if (!this.flag) {
      let object = this[part];
      this.show1(object);
      this.flag = true;
    }
  }
  hide1(object) {
    object.label.hide();
    for (let button of object.colorButtons) {
      button.hide();
    }
    object.leftButton.hide();
    object.rightButton.hide();
    for (let slider of object.sliders) {
      slider.hide();
    }
  }
  show1(object) {
    object.label.show();
    for (let button of object.colorButtons) {
      button.show();
    }
    object.leftButton.show();
    object.rightButton.show();
    for (let slider of object.sliders) {
      slider.show();
    }
  }
}

class SetObjectClass2 extends SetObjectClass {
  constructor(part) {
    super(part);
    this.pShape = 1;
    this.shapeButtons = this.setShapeButton();
    this.changeShape(0)();
  }
  changeShape(i) {
    return () => {
      joint.shape = Number(i);
      if (this.pShape != i) {
        this.shapeButtons[this.pShape].style("background-color", "white");
        this.shapeButtons[i].style("background-color", this.isPressedColor);
        this.pShape = i;
      }
    };
  }
  setShapeButton(){
    const btnSize = 70;
    const posY = specialbtnPosY;
    const shapeLabels = ["〇", "☐", "△", "✕"];
    let buttons = [];
    for (let i in shapeLabels) {
      let posX = 350 + btnSize * i;
      let button = createButton(shapeLabels[i]);
      button.addClass("myButtonStyle3");
      button.position(posX, posY);
      button.style("width", btnSize + "px");
      button.mouseClicked(this.changeShape(i));
      buttons[i] = button;
    }
    return buttons;
  }
}

class Screen4ObjClass extends Screen3ObjClass {
  constructor() {
    super();
  }
  hide() {
    if (this.flag) {
      let object = this.joint;
      this.hide1(object);
      this.hide2(object);
      this.flag = false;
    }
  }
  show() {
    if (!this.flag) {
      let object = this.joint;
      this.show1(object);
      this.show2(object);
      this.flag = true;
    }
  }
  hide2(object) {
    for (let button of object.shapeButtons) {
      button.hide();
    }
  }
  show2(object) {
    for (let button of object.shapeButtons) {
      button.show();
    }
  }
}

let screen3Obj = new Screen3ObjClass();
let screen4Obj = new Screen4ObjClass();

function setScreenObj(){
  for (let part of parts) {
    screen3Obj[part] = new SetObjectClass(handObj[part]);
  }
  screen4Obj.joint = new SetObjectClass2(joint);
}

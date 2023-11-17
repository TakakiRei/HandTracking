class SetObjectClass {
  constructor(part) {
    this.label = createElement("font", part.label);
    this.label.addClass("myFontStyle");
    this.label.position(20, 10);
    this.leftButton = this.setButton("◀ ", 50, ()=>{});
    this.rightButton = this.setButton("▶ ", 300, ()=>{});
    this.sliders = [];
    for (let i = 0; i < 3; i++) {
      let slider = createSlider(0, 255, part.col[i]);
      slider.addClass("mySliderStyle");
      slider.position(80, sldPosY + sldDeltaY * i);
      this.sliders[i] = slider;
    }
  }
  setButton(label, posX, func) {
    let button = createButton(label);
    button.addClass("myButtonStyle2");
    button.position(posX, 100);
    button.mouseClicked(func);
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
    object.leftButton.hide();
    object.rightButton.hide();
    for (let slider of object.sliders) {
      slider.hide();
    }
  }
  show1(object) {
    object.label.show();
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
    const shapeLabels = ["〇", "☐", "△", "✕"];
    this.previousShape = 0;
    this.shapeButtons = [];
    this.isPressedColor = this.specifyRGB(180);
    for (let i in shapeLabels) {
      let button = createButton(shapeLabels[i]);
      button.addClass("myButtonStyle3");
      button.position(350 + 70 * i, 170);
      button.mouseClicked(this.changeShape(i));
      this.shapeButtons[i] = button;
    }
    this.shapeButtons[0].style("background-color", this.isPressedColor);
  }
  specifyRGB(l) {
    return "rgb(" + l + "," + l + "," + l + ")";
  }
  changeShape(i) {
    return () => {
      joint.shape = Number(i);
      if (this.previousShape != i) {
        this.shapeButtons[this.previousShape].style("background-color", "white");
        this.shapeButtons[i].style("background-color", this.isPressedColor);
        this.previousShape = i;
      }
    };
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

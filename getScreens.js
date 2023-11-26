const l = 128;
const backgroundAlpha = 180;

const weight = 1;
const diameter = btnHeight - joint.weight;

function slidersColor(sliders){
  let R = sliders[0].value();
  let G = sliders[1].value();
  let B = sliders[2].value();
  return [R, G, B];
}

function drawSettingScreen(part){
  if (screen >= 2) {
    screen3Obj.hide(part);
    screen4Obj.hide();
    noStroke();
    fill(l, l, l, backgroundAlpha);
    rect(0, 0, width, height);

    if (screen == 2) {
      let leftX = btnDeltaX + 20 + weight;
      let posY = btnPosY + weight;
      stroke(0);
      strokeWeight(weight);
      for (let i in parts) {
        let part = parts[i];
        let bool = i % 2;
        let posX = leftX + btnDeltaX * bool;
        fill(handObj[part].col);
        rect(posX, posY, btnHeight);
        posY += btnDeltaY * bool;
      }
      
      joint.drawJoint(270, 320, diameter);
    } else {
      const posX = sldPosX;
      stroke(0);
      strokeWeight(weight);
      textSize(fontSize);
      let colorText = ["R", "G", "B"];
      for (let i in colorText) {
        let posY = sldPosY + sldDeltaY * i + 32;
        let col = [0, 0, 0];
        col[i] = 255;
        fill(col);
        text(colorText[i], posX, posY);
      }
      
      if (screen == 3) {
        screen3Obj.show(part);
        let sliders = screen3Obj[part].sliders;
        let col = slidersColor(sliders);
        image(handImg, 400, 150);
        stroke(col);
        strokeWeight(12);
        handObj[part].col = col;
        handObj[part].drawLine();
      } else {
        screen4Obj.show();
        let sliders = screen4Obj.joint.sliders;
        let col = slidersColor(sliders);
        joint.col = col;
        joint.drawJoint(490, 300, 80);
      }
    }
  }
}

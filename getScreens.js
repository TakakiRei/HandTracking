const weight = 1;
const size = btnHeight - 2 * weight;
const diameter = btnHeight - joint.weight;

function drawRect(X, Y, col){
  stroke(0);
  strokeWeight(weight);
  fill(col);
  rect(X, Y, size);
}

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
    fill(128, 128, 128, 180);
    rect(0, 0, width, height);

    if (screen == 2) {
      let leftX = btnDeltaX + 20 + weight;
      let Y = btnPosY + weight;
      for (let i in parts) {
        let part = parts[i];
        let bool = i % 2;
        let X = leftX + btnDeltaX * bool;
        drawRect(X, Y, handObj[part].col);
        Y += btnDeltaY * bool;
      }
      
      //let w = btnHeight - joint.weight;
      joint.drawJoint(270, 320, diameter);
    } else {
      stroke(0);
      strokeWeight(weight);
      textSize(40);
      let colorText = ["R", "G", "B"];
      for (let i in colorText) {
        let Y = sldPosY + sldDeltaY * i + 32;
        let col = [0, 0, 0];
        col[i] = 255;
        fill(col);
        text(colorText[i], 40, Y);
      }
      
      if (screen == 3) {
        screen3Obj.show(part);
        let sliders = screen3Obj[part].sliders;
        let col = slidersColor(sliders);
        image(handImg, 400, 150);
        stroke(col);
        strokeWeight(12);
        handObj[part].drawLine();
        handObj[part].col = col;
      } else {
        screen4Obj.show();
        let sliders = screen4Obj.joint.sliders;
        let col = slidersColor(sliders);
        joint.col = col;
        joint.drawJoint(490, 320, 60);
      }
    }
  }
}

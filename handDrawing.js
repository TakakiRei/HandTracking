class PositionsClass {
  constructor(landmarks) {
    this.positions = this.setPositions(landmarks);
    this.annotations = this.setAnnotations();
  }
  setPositions(landmarks) {
    let positions = [];
    for (let i = 0; i < 21; i++) {
      let posX = width * landmarks[i].x;
      let posY = height * landmarks[i].y;
      positions[i] = { x: posX, y: posY };
    }
    return positions;
  }
  setAnnotation(...indexes) {
    let annotation = [];
    for (let index of indexes) {
      annotation.push(this.positions[index]);
    }
    return annotation;
  }
  setAnnotations() {
    let annotations = {};
    annotations.thumb = this.setAnnotation(1, 2, 3, 4);
    annotations.indexFinger = this.setAnnotation(5, 6, 7, 8);
    annotations.middleFinger = this.setAnnotation(9, 10, 11, 12);
    annotations.ringFinger = this.setAnnotation(13, 14, 15, 16);
    annotations.pinky = this.setAnnotation(17, 18, 19, 20);
    annotations.palmBase = this.setAnnotation(0, 1, 5, 9, 13, 17, 0);
    return annotations;
  }
}

function drawPoses(oneHandPoses, alphaValue = 255) {
  for (let annotations of oneHandPoses) {
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

function drawhands(){
  let landmarks = [];
  let oneHandPoses = [];
  
  for (let i in landmarksArray) {
    let posObject = new PositionsClass(landmarksArray[i]);
    landmarks = landmarks.concat(posObject.positions);
    oneHandPoses[i] = posObject.annotations;
  }

  strokeWeight(8);
  noFill();
  if (trajectoryFlag) {
    if (trajectory.length >= shortFrameNumber) {
      trajectory.shift();
    }
    trajectory.push(oneHandPoses);

    for (let i in trajectory) {
      let oneHandPoses = trajectory[i];
      let alphaValue = ((1 + Number(i)) * 255) / shortFrameNumber;
      drawPoses(oneHandPoses, alphaValue);
    }
  } else {
    drawPoses(oneHandPoses);
  }

  for (let position of landmarks) {
    joint.drawJoint(position.x, position.y, 24);
  }
}

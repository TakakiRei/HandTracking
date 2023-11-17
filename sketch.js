let video;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  video = createCapture(VIDEO);
  video.hide();
  frameRate(frameNumber);
  setButtons();
  setScreenObj();
}

function draw() {
  background(0);
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  drawhands();
  
  translate(width, 0);
  scale(-1, 1);
  drawRipples();
  buttonObj.buttonShow(screen);
  drawSettingScreen(currentPart);
}

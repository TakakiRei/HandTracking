/* jshint esversion: 8 */

const videoElement = document.getElementsByClassName("input_video")[0];
videoElement.style.display = "none";

const hands = new Hands({
  locateFile: (file) => {
    screen = 1;
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

hands.setOptions({
  maxNumHands: 4, 
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

let getPoses = (results) => {
  landmarksArray = results.multiHandLandmarks;
}
hands.onResults(getPoses);

const camera0 = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: canvasWidth,
  height: canvasHeight,
});
camera0.start();

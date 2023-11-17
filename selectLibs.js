let d = new Date();
let dayOfWeek = d.getDay();
console.log(dayOfWeek);

if (1) {
  loadScript("setScreens.js");
  loadScript("button.js");
  loadScript("handDrawing.js");
  loadScript("getScreens.js");
}

function loadScript(src) {
  let script = document.createElement("script");
  script.src = src;
  document.head.appendChild(script);
}

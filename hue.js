var hue = require("node-hue-api"),
HueApi = hue.HueApi,
lightState = hue.lightState;

var host = "192.168.2.107",
username = "warpaintmedia",
api = new HueApi(host, username);

var colors = [
  [149, 210, 184], // teal
  [246, 30, 47], // red
  [229, 233, 141], // green
  [255, 175, 79], // orange
  [165, 25, 41] // maroon
  ];

  var flash = lightState.create().on().white(154, 100).transition(0);
  var counter = 0;
  var transition = 2;
  var looper = setInterval(function() {
    var state = lightState.create().on().rgb(
      colors[counter][0],
      colors[counter][1],
      colors[counter][2]
      ).brightness(50).transition(transition);
    api.setLightState(3, state);
    counter += 1;
    if (counter === colors.length) {
      api.setLightState(3, flash);
      counter = 0;
    }
  }, transition * 1250);

// // --------------------------
// // Using a promise
// api.setLightState(3, state)
// .then(delay)
// .done();
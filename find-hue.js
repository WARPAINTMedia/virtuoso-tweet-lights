var hue = require("node-hue-api");

var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
  console.log(JSON.stringify(result, null, 2));
};

var displayBridges = function(bridge) {
  console.log("Hue Bridges Found: " + JSON.stringify(bridge));
  var host = bridge[0].ipaddress,
  username = "warpaintmedia",
  api = new HueApi(host, username);
  api.groups()
  .then(displayResults)
  .done();
  api.getGroup(0)
    .then(displayResults)
    .done();
    api.searchForNewLights()
    .then(displayResults)
    .done();
  api.newLights()
    .then(displayResults)
    .done();
};

// --------------------------
// Using a promise
hue.locateBridges().then(displayBridges).done();
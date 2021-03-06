// load our config file
var config = require('./config');
var Twit = require('twit');
// stat the twit stuff
var T = new Twit({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret
});

// filter the public stream by english tweets containing `#toronto, #ldnont, #BostonStrong`
var stream = T.stream('statuses/filter', {
  track: ['#virtuoso14', '#virtuoso2014', '#iabc', '#iabclondon', '#iabcldnont', '#virtuoso', '#virtuosoawards', '@iabclondon', '@EdgarAndJoes'], // '#virtuoso14', '#iabc', '#iabclondon', '#iabcldnont', '#virtuoso', '#virtuosoawards', '@iabclondon', '@EdgarAndJoes'
  language: 'en'
});

var hue = require("node-hue-api"),
  HueApi = hue.HueApi,
  lightState = hue.lightState;

// flash when tweets
var flash = lightState.create().white(154, 100).transition(0);
// dim when flash is over
var dim = lightState.create().white(154, 10).transition(0);

var Emitter = require('events').EventEmitter,
    emitter = new Emitter();
    emitter.setMaxListeners(2);

var colors = [
  {
    r: 149,
    g: 210,
    b: 184
  }, // teal
  {
    r: 246,
    g: 30,
    b: 47
  }, // red
  {
    r: 200,
    g: 255,
    b: 138
  }, // green
  {
    r: 255,
    g: 175,
    b: 79
  }, // orange
  {
    r: 165,
    g: 25,
    b: 41
  } // maroon
];

var names = ['teal', 'red', 'green', 'orange', 'maroon'];

emitter.on('starting', function (i) {
  console.log('starting', names[i]);
});

var currentLight = 2; // my one light that is setup

function loop(api) {
  var counter = 0;
  // number of seconds to wait
  var transition = 1;
  var looper = setInterval(function () {
    emitter.emit('starting', counter);
    var state = lightState.create().rgb(
      colors[counter].r,
      colors[counter].g,
      colors[counter].b
    ).brightness(100).transition(transition);
    api.setGroupLightState(0, state);
    counter += 1;
    if (counter === colors.length) {
      counter = 0;
    }
  }, transition * 5250);
  emitter.on('tweet', function handleTweet() {
    clearInterval(looper);
    // use a noop function to avoid errors
    emitter.removeListener('tweet', function(){});
  });
}

// find the hue base on this network
hue.locateBridges(function (err, result) {
  if (err) {
    throw err;
  }
  // connect using the located IP and the config username
  var api = new HueApi(result[0].ipaddress, config.username);
  // start the loop with the active api
  loop(api);

  stream.on('tweet', function (tweet) {
    console.log("> %s \r", tweet.text);
    emitter.emit('tweet');
    api.setGroupLightState(0, flash).then(loop.bind(this, api));
  });
});

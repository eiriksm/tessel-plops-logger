# tessel-plops-logger

[![Build Status](https://travis-ci.org/eiriksm/tessel-plops-logger.svg?branch=master)](https://travis-ci.org/eiriksm/tessel-plops-logger)
[![Coverage Status](http://img.shields.io/coveralls/eiriksm/tessel-plops-logger.svg)](https://coveralls.io/r/eiriksm/tessel-plops-logger?branch=master)
[![Code Climate](http://img.shields.io/codeclimate/github/eiriksm/tessel-plops-logger.svg)](https://codeclimate.com/github/eiriksm/tessel-plops-logger)
[![Dependency Status](https://david-dm.org/eiriksm/tessel-plops-logger.svg?theme=shields.io)](https://david-dm.org/eiriksm/tessel-plops-logger)

Logs the plops of a beer fermentation. Like so.

![Plopping action](https://raw.github.com/eiriksm/tessel-plops-logger/master/plops.gif)

## Usage

```js
var tessel = require('tessel');
var ambientLib = require('ambient-attx4');
var ambient = ambientLib.use(tessel.port.B);

var options = {
  debug: true,  // Whether or not to spit out all kinds of debug messages.
  interval: 3,  // Interval for sending data back (in s.)
  ledNumber: 1, // The led number on the tessel to light up when sensing a plop.
  level: 0.017, // The volume level to trigger the sound trigger.
  maxLevel: 0.1, // The max volume level (higher sounds will be ignored).
  plopCallback: function (err, data) {} // Callback that will be called on every plop.
};

var tpl = require('tessel-plops-logger')(ambient, options, tessel);
var numberOfChecks = 0;

// Function to call at every interval end.
function onIntervalEnd(err, plops) {
  console.log('Plops per 3s at %s is %d', new Date(), plops);
  numberOfChecks++;
  if (numberOfChecks > 3) {
    // This will stop the interval based checks.
    tpl.stop();
  }
}

tpl.start(onIntervalEnd);

'use strict';

function PlopsLogger(ambient, opts, tessel) {
  var self = this;
  self.log('Created new plop logger with options ', opts);
  self.ambient = ambient;
  self.level = opts.level || 0.017;
  self.maxLevel = opts.maxLevel || 0.023;
  self.debug = opts.debug || false;
  self.interval = opts.interval || 60000;
  var ledNumber = opts.ledNumber || 1;
  self.led1 = tessel.led[ledNumber];
  self.id = Math.random();
  self.log('Starting plop logger with id', self.id);
}

PlopsLogger.prototype.start = function(callback) {
  var self = this;
  var plops = 0;
  self.ambient.on('ready', function () {
    self.ambient.setSoundTrigger(self.level);
    self.log('Ambient module ready');

    self.ambient.on('sound-trigger', function(data) {
      self.log('Sound triggered with level ' + data);
      self.ambient.clearSoundTrigger();
      if (data > self.maxLevel) {
        setTimeout(function () {
          self.ambient.setSoundTrigger(self.level);
        }, 1000);
        return;
      }
      else {
        plops++;
        self.led1.write(true);
      }

      setTimeout(function () {

        self.ambient.setSoundTrigger(self.level);
        self.led1.write(false);

      }, 1000);
    });
  });
  self.callback = callback;
  self._repeater = setInterval(function() {
    self.log('Sending callback for id', self.id);
    if (self.callback) {
      self.callback(plops);
    }
    plops = 0;
  }, self.interval * 1000);

};

PlopsLogger.prototype.stop = function() {
  clearInterval(this._repeater);
};

PlopsLogger.prototype.log = function() {
  if (this.debug) {
    console.log.apply(console, arguments);
  }
};

module.exports = function(lib, opts, tessel) {
  // These parameters are really required.
  if (!lib || !opts) {
    throw new Error('Please provide all options required (lib and opts)');
  }
  var ambient = lib;
  return new PlopsLogger(ambient, opts, tessel);
};

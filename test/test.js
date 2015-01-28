'use strict';

require('should');
var lastWritten = '';
var mockLed = {
  write: function(d) {
    lastWritten = d;
  }
};
var mockTessel = {
  led: [
    mockLed,
    mockLed
  ]
};
var events = require('events');
var mockLib = new events.EventEmitter();
var triggerLevel = 0;
mockLib.setSoundTrigger = function(l) {
  triggerLevel = l;
};
mockLib.clearSoundTrigger = function() {
  triggerLevel = 0;
};

describe('Module functionality', function() {
  it('Should throw an error if inited without options', function() {
    var l = require('..');
    l.should.throw();
  });
  it('Should return a function if inited correctly', function() {
    var l = require('..')({}, {}, mockTessel);
    l.should.be.instanceOf(Object);
    l.start.should.be.instanceOf(Function);
  });
  it('Should return a value if we tell it to', function(done) {
    var l = require('..')(mockLib, {
      interval: 0.5,
      level: 20,
      maxLevel: 25
    }, mockTessel);
    l.start(function(d) {
      // as this is an interval, we just ignore all other data than the first.
      l.stop();
      lastWritten.should.equal(true);
      d.should.equal(3);
      done();
    });
    mockLib.emit('ready');
    mockLib.emit('sound-trigger', 22);
    mockLib.emit('sound-trigger', 22);
    mockLib.emit('sound-trigger', 22);
  });
  it('Should increase the coverage on these random features', function(done) {
    var l = require('..')(mockLib, {
      interval: 1.1,
      // Adding debug for coverage.
      debug: true,
      level: 20,
      maxLevel: 25
    }, mockTessel);
    l.start(function(d) {
      triggerLevel.should.equal(20);
      l.stop();
      d.should.equal(0);
      done();
    });
    mockLib.emit('ready');
    // Emit over the max level.
    triggerLevel.should.equal(20);
    mockLib.emit('sound-trigger', 26);
    triggerLevel.should.equal(0);

  });
});

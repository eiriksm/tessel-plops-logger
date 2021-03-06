'use strict';

var should = require('should');
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
    var pc = 0;
    var l = require('..')(mockLib, {
      interval: 0.5,
      level: 20,
      maxLevel: 25,
      plopCallback: function(e) {
        should(e).equal(null);
        pc++;
      }
    }, mockTessel);
    l.start(function(e, d) {
      pc.should.equal(3);
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
    l.start(function(e, d) {
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
  it('Should call the callback with an error on error emit', function(done) {
    var l = require('..')(mockLib, {
      interval: 1.1,
      level: 20,
      maxLevel: 25
    }, mockTessel);
    l.start(function(e) {
      e.should.equal('testerror');
      l.stop();
      done();
    });
    mockLib.emit('ready');
    // Emit an error.
    mockLib.emit('error', 'testerror');
  });
  it('Should increase the coverage with this random thing', function(done) {
    var l = require('..')(mockLib, {
      interval: 1.1,
      level: 20,
      maxLevel: 25
    }, mockTessel);
    l.start();
    mockLib.emit('ready');
    triggerLevel.should.equal(20);
    lastWritten = 0;
    mockLib.emit('sound-trigger', 22);
    triggerLevel.should.equal(0);
    setTimeout(function() {
      lastWritten.should.equal(false);
      done();
    }, 1500);
  });
});

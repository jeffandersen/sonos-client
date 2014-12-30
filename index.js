/*jshint browser: true*/

var sonos = exports; exports.constructor = function sonos(){};

sonos.browserLoaded = (typeof window !== 'undefined');

sonos.v1 = require('./lib/v1');

if (sonos.browserLoaded) {
  window.Sonos = sonos;
}

var _ = require('lodash');

var Players = require('./players');
var Zones = require('./zones');

function Version1(opts) {
  _.extend(this, opts);
}

Version1.prototype.players = function(param, opts) {
  return new Players(this, param, opts);
};

Version1.prototype.zones = function(param, opts) {
  return new Zones(this, param, opts);
};

module.exports = Version1;

var Client = require('../client').Client;
var actions = require('../actions');

var _ = require('lodash');

var STATELESS_ACTIONS = [
  'play',
  'pause',
  'playpause',
  'mute',
  'unmute'
];

var STATEFUL_ACTIONS = [
  'volume',
  'crossfade',
  'shuffle',
  'repeat'
];

/**
 * Represents player resources on your Sonos network
 *
 * @param {object} client - The underlying api client object
 * @param {string|number|object} param - Lookup parameter, typically a roomName
 * @param {object} opts - Lookup query parameters used for filtering and sort
 */
function Players(client, param, opts) {
  this.endpoint = client.endpoint;

  if (_.isPlainObject(param)) {
    opts = param;
    param = null;
  }

  this.pathname = '/players/:roomName/:action';

  this.body = {};
  this.query = _.extend({}, opts);

  this.params = {};
  if (param) {
    this.params.roomName = param;
  }

  this.client = new Client(client);

  // Register stateless actions for the client
  var self = this;
  STATELESS_ACTIONS.forEach(function(action) {
    self[action] = actions._stateless.bind(self, 'roomName', action);
  });

  // Register stateful actions for the client
  STATEFUL_ACTIONS.forEach(function(action) {
    self[action] = actions._stateful.bind(self, 'roomName', action);
  });

  // Register abstracted functions
  this.playlist = actions._playlist.bind(this, 'roomName');

  return this;
}

/**
 * Make an API request for player(s)
 *
 * @param {object} opts - Optional filtering/query params
 * @param {function} cb - Callback function
 */
Players.prototype.get = function(opts, cb) {
  if (_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  var pathname = this.pathname.replace('/:action', '');
  var prefix = this.params.roomName? ':' : '/:'; 
  var value = this.params.roomName || '';

  pathname = pathname.replace(prefix + 'roomName', value);

  this.client.get(pathname, function(err, body) {
    if (err) {
      return cb(err);
    }

    cb(null, body);
  });
};

/**
 * Make an API request for player(s) (alias of get)
 *
 * @param {object} opts - Optional filtering/query params
 * @param {function} cb - Callback function
 */
Players.prototype.list = function(opts, cb) {
  return this.get.call(this, opts, cb);
};

/**
 * List playlists for the configured player name
 *
 * @param {object} opts - Optional filtering/query params
 * @param {function} cb - Callback function
 */
Players.prototype.playlists = function(opts, cb) {
  if (_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }
  if (!this.params.roomName) {
    throw new Error('roomName must be supplied to players() for actions');
  }

  var pathname = this.pathname.replace(':action', 'playlists');
  var value = this.params.roomName;
  var prefix = ':';

  pathname = pathname.replace(prefix + 'roomName', value);

  this.client.get(pathname, function(err, body) {
    if (err) {
      return cb(err);
    }

    cb(null, body);
  });
};

module.exports = Players;

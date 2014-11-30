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
 * Represents zone resources on your Sonos network
 *
 * @param {object} client - The underlying api client object
 * @param {string|number|object} param - Lookup parameter, typically a uuid
 * @param {object} opts - Lookup query parameters used for filtering and sort
 */
function Zones(client, param, opts) {
  this.endpoint = client.endpoint;

  if (_.isPlainObject(param)) {
    opts = param;
    param = null;
  }

  this.pathname = '/zones/:uuid/:action';

  this.body = {};
  this.query = _.extend({}, opts);

  this.params = {};
  if (param) {
    this.params.uuid = param;
  }

  this.client = new Client(client);

  // Register stateless actions for the client
  var self = this;
  STATELESS_ACTIONS.forEach(function(action) {
    self[action] = actions._stateless.bind(self, 'uuid', action);
  });

  // Register stateful actions for the client
  STATEFUL_ACTIONS.forEach(function(action) {
    self[action] = actions._stateful.bind(self, 'uuid', action);
  });

  // Register abstracted functions
  this.playlist = actions._playlist.bind(this, 'uuid');

  return this;
}

/**
 * Make an API request for zone(s)
 *
 * @param {object} opts - Optional filtering/query params
 * @param {function} cb - Callback function
 */
Zones.prototype.get = function(opts, cb) {
  if (_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  var pathname = this.pathname.replace('/:action', '');
  var prefix = this.params.uuid? ':' : '/:'; 
  var value = this.params.uuid || '';

  pathname = pathname.replace(prefix + 'uuid', value);

  this.client.get(pathname, function(err, body) {
    if (err) {
      return cb(err);
    }

    cb(null, body);
  });
};

/**
 * Make an API request for zone(s) (alias of get)
 *
 * @param {object} opts - Optional filtering/query params
 * @param {function} cb - Callback function
 */
Zones.prototype.list = function(opts, cb) {
  return this.get.call(this, opts, cb);
};

/**
 * List playlists for the configured zone uuid
 *
 * @param {object} opts - Optional filtering/query params
 * @param {function} cb - Callback function
 */
Zones.prototype.playlists = function(opts, cb) {
  if (_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }
  if (!this.params.uuid) {
    throw new Error('uuid must be supplied to zones() for actions');
  }

  var pathname = this.pathname.replace(':action', 'playlists');
  var value = this.params.uuid;
  var prefix = ':';

  pathname = pathname.replace(prefix + 'uuid', value);

  this.client.get(pathname, function(err, body) {
    if (err) {
      return cb(err);
    }

    cb(null, body);
  });
};

module.exports = Zones;

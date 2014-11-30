var actions = exports; exports.constructor = function actions(){};

var _ = require('lodash');

/**
 * Load the track at a given index
 *
 * @param {string} _resource - Path parameter name
 * @param {string} index - Track index
 * @param {object} opts - Optional query parameters
 * @param {function} cb - Callback function
 */
actions._seek = function(_resource, index, opts, cb) {
  if (_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }
  if (!this.params[_resource]) {
    throw new Error(_resource + ' must be supplied to resource for actions');
  }
  if (opts && !_.isPlainObject(opts)) {
    throw new Error('opts must be an object');
  }

  var pathname = this.pathname.replace(':action', 'seek');
  var value = this.params[_resource];
  var prefix = ':';

  pathname = pathname.replace(prefix + _resource, value);

  index = _.isNumber(index)? parseInt(index, 10) : 0;

  this.client.post(pathname, {
    index: index
  }, opts, function(err, body) {
    if (err) {
      return cb(err);
    }

    cb(null, body);
  });
};

/**
 * Load a given playlist
 *
 * @param {string} _resource - Path parameter name
 * @param {string} title - Playlist title
 * @param {object} opts - Optional query parameters
 * @param {function} cb - Callback function
 */
actions._playlist = function(_resource, title, opts, cb) {
  if (_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }
  if (!this.params[_resource]) {
    throw new Error(_resource + ' must be supplied to resource for actions');
  }
  if (opts && !_.isPlainObject(opts)) {
    throw new Error('opts must be an object');
  }

  var pathname = this.pathname.replace(':action', 'playlist');
  var value = this.params[_resource];
  var prefix = ':';

  pathname = pathname.replace(prefix + _resource, value);

  this.client.post(pathname, {
    title: title
  }, opts, function(err, body) {
    if (err) {
      return cb(err);
    }

    cb(null, body);
  });
};

/**
 * Process stateless action
 *
 * @param {string} _resource - Path parameter name
 * @param {string} _action - Action name
 * @param {object} opts - Optional query parameters
 * @param {function} cb - Callback function
 */
actions._stateless = function(_resource, _action, opts, cb) {
  if (_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }
  if (!this.params[_resource]) {
    throw new Error(_resource + ' must be supplied to resource for actions');
  }
  if (opts && !_.isPlainObject(opts)) {
    throw new Error('opts must be an object');
  }

  var pathname = this.pathname.replace(':action', _action);
  var value = this.params[_resource];
  var prefix = ':';

  pathname = pathname.replace(prefix + _resource, value);

  this.client.post(pathname, function(err, body) {
    if (err) {
      return cb(err);
    }

    cb(null, body);
  });
};

/**
 * Process actions that require parameters
 *
 * @param {string} _resource - Path parameter name
 * @param {string} _action - Action name
 * @param {object} param - State parameter to send
 * @param {object} opts - Optional query parameters
 * @param {function} cb - Callback function
 */
actions._stateful = function(_resource, _action, param, opts, cb) {
  if (_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }
  if (!this.params[_resource]) {
    throw new Error(_resource + ' must be supplied to resource for actions');
  }
  if (!_.isPlainObject(opts)) {
    throw new Error('opts must be an object');
  }

  var pathname = this.pathname.replace(':action', _action);
  var value = this.params[_resource];
  var prefix = ':';

  pathname = pathname.replace(prefix + _resource, value);

  this.client.post(pathname, {
    state: param
  }, opts, function(err, body) {
    if (err) {
      return cb(err);
    }

    cb(null, body);
  });
};

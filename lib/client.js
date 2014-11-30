var client = exports; exports.constructor = function client(){};

var _ = require('lodash');
var request = require('request');

function Client(opts) {
  this.endpoint = opts.endpoint;
}

Client.prototype._request = function(opts, cb) {
  if (!_.isPlainObject(opts)) {
    throw new Error('Opts argument must be an object');
  }
  if (!_.isUndefined(opts.query) && !_.isPlainObject(opts.query)) {
    throw new Error('Query argument must be an object');
  }
  if (!_.isUndefined(opts.body) && !_.isPlainObject(opts.body)) {
    throw new Error('Body argument must be an object');
  }

  var headers = {
    'Content-Type': 'application/json'
  };

  var requestOpts = {
    json: true,
    method: opts.method || 'GET',
    url: this.endpoint + opts.url,
    headers: _.extend({}, opts.headers, headers)
  };

  if (!_.isUndefined(opts.body)) {
    requestOpts.body = opts.body;
  }
  if (_.keys(opts.query).length > 0) {
    requestOpts.qs = opts.query;
  }

  request(requestOpts, function(err, res, body) {
    if (err) {
      return cb(err);
    }
  
    cb(null, body, res);
  });
};

Client.prototype.post = function(path, body, query, cb) {
  if (!_.isString(path)) {
    throw new Error('Path argument must be a string');
  }
  if (_.isFunction(body)) {
    cb = body;
    body = {};
    query = {};

  } else if (_.isFunction(query)) {
    cb = query;
    query = {};

  }

  this._request({
    method: 'POST',
    url: path,
    body: body,
    query: query
  }, cb);
};

Client.prototype.put = function(path, body, query, cb) {
  if (!_.isString(path)) {
    throw new Error('Path argument must be a string');
  }
  if (_.isFunction(body)) {
    cb = body;
    body = {};
    query = {};

  } else if (_.isFunction(query)) {
    cb = query;
    query = {};

  }

  if (!_.isPlainObject(query)) {
    throw new Error('Query argument must be an object');
  }

  if (!_.isUndefined && !_.isPlainObject(body)) {
    throw new Error('Body argument must be an object');
  }

  this._request({
    method: 'PUT',
    url: path,
    body: body,
    query: query
  }, cb);
};

Client.prototype.patch = function(path, body, query, cb) {
  if (!_.isString(path)) {
    throw new Error('Path argument must be a string');
  }
  if (_.isFunction(body)) {
    cb = body;
    body = {};
    query = {};

  } else if (_.isFunction(query)) {
    cb = query;
    query = {};

  }

  if (!_.isPlainObject(query)) {
    throw new Error('Query argument must be an object');
  }

  if (!_.isUndefined && !_.isPlainObject(body)) {
    throw new Error('Body argument must be an object');
  }

  this._request({
    method: 'PATCH',
    url: path,
    body: body,
    query: query
  }, cb);
};

Client.prototype.get = function(path, query, cb) {
  if (!_.isString(path)) {
    throw new Error('Path argument must be a string');
  }
  if (_.isFunction(query)) {
    cb = query;
    query = {};
  }

  this._request({
    method: 'GET',
    url: path,
    query: query
  }, cb);
};

client.Client = Client;

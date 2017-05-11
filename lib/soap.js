/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */

"use strict";

var Client = require('./client').Client,
  HttpClient = require('./http'),
  security = require('./security'),
  utils = require('./utils'),
  wsdl = require('./wsdl'),
  WSDL = require('./wsdl').WSDL;

function createCache() {
  var cache = {};
  return function (key, load, callback) {
    if (!cache[key]) {
      load(function (err, result) {
        if (err) {
          return callback(err);
        }
        cache[key] = result;
        callback(null, result);
      });
    } else {
      utils.nextTick(function () {
        callback(null, cache[key]);
      });
    }
  };
}
var getFromCache = createCache();

function _requestWSDL(url, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  var openWsdl = wsdl.open_wsdl.bind(null, url, options);

  if (options.disableCache === true) {
    openWsdl(callback);
  } else {
    getFromCache(url, openWsdl, callback);
  }
}

function createClient(url, options, callback, endpoint) {
  if (typeof options === 'function') {
    endpoint = callback;
    callback = options;
    options = {};
  }
  endpoint = options.endpoint || endpoint;
  _requestWSDL(url, options, function(err, wsdl) {
    callback(err, wsdl && new Client(wsdl, endpoint, options));
  });
}

exports.security = security;
exports.BasicAuthSecurity = security.BasicAuthSecurity;
exports.WSSecurity = security.WSSecurity;
exports.ClientSSLSecurity = security.ClientSSLSecurity;
exports.ClientSSLSecurityPFX = security.ClientSSLSecurityPFX;
exports.BearerSecurity = security.BearerSecurity;
exports.createClient = createClient;
exports.passwordDigest = utils.passwordDigest;
exports.WSDL = WSDL;

// Export Client and Server to allow customization
exports.Client = Client;
exports.HttpClient = HttpClient;

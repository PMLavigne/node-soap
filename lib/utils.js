
"use strict";
var crypto = require('crypto');
exports.passwordDigest = function passwordDigest(nonce, created, password) {
  // digest = base64 ( sha1 ( nonce + created + password ) )
  var pwHash = crypto.createHash('sha1');
  var rawNonce = new Buffer(nonce || '', 'base64').toString('binary');
  pwHash.update(rawNonce + created + password);
  return pwHash.digest('base64');
};


var TNS_PREFIX = '__tns__'; // Prefix for targetNamespace

exports.TNS_PREFIX = TNS_PREFIX;

/**
 * Find a key from an object based on the value
 * @param {Object} Namespace prefix/uri mapping
 * @param {*} nsURI value
 * @returns {String} The matching key
 */
exports.findPrefix = function(xmlnsMapping, nsURI) {
  for (var n in xmlnsMapping) {
    if (n === TNS_PREFIX) continue;
    if (xmlnsMapping[n] === nsURI) {
      return n;
    }
  }
};


/**
 * Cross-platform nextTick functionality. Will attempt to use process.nextTick, setImmediate and setTimeout before
 * giving up.
 *
 * @param {Function} func Function to run on next tick
 */
exports.nextTick = function(func) {
  if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
    return process.nextTick(func);
  }

  if (typeof window !== 'undefined' && typeof window.setImmediate === 'function') {
    return window.setImmediate(func);
  }

  if (typeof window !== 'undefined' && typeof window.setTimeout === 'function') {
    return window.setTimeout(func, 0);
  }

  if (typeof setImmediate === 'function') {
    return setImmediate(func);
  }

  if (typeof setTimeout === 'function') {
    return setTimeout(func, 0);
  }

  throw new Error('Cannot call nextTick, setImmediate or setTimeout');
};

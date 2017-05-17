'use strict';

var https = require('https')
  , _ = require('lodash');

/**
 * activates SSL for an already existing client
 *
 * @module ClientSSLSecurity
 * @param {Buffer|String}   key
 * @param {Buffer|String}   cert
 * @param {Buffer|String|Array}   [ca]
 * @param {Object}          [defaults]
 * @constructor
 */
function ClientSSLSecurity(key, cert, ca, defaults) {
  if (key) {
    if(Buffer.isBuffer(key)) {
      this.key = key;
    } else if (typeof key === 'string') {
      throw new Error('File path key not supported in browser-only soap');
    } else {
      throw new Error('key should be a buffer or a string!');
    }
  }

  if (cert) {
    if(Buffer.isBuffer(cert)) {
      this.cert = cert;
    } else if (typeof cert === 'string') {
      throw new Error('File path cert not supported in browser-only soap');
    } else {
      throw new Error('cert should be a buffer or a string!');
    }
  }

  if (ca) {
    if(Buffer.isBuffer(ca) || Array.isArray(ca)) {
      this.ca = ca;
    } else if (typeof ca === 'string') {
      throw new Error('File path CA not supported in browser-only soap');
    } else {
      defaults = ca;
      this.ca = null;
    }
  }

  this.defaults = {};
  _.merge(this.defaults, defaults);
}

ClientSSLSecurity.prototype.toXML = function(headers) {
  return '';
};

ClientSSLSecurity.prototype.addOptions = function(options) {
  options.key = this.key;
  options.cert = this.cert;
  options.ca = this.ca;
  _.merge(options, this.defaults);
  options.agent = new https.Agent(options);
};

module.exports = ClientSSLSecurity;

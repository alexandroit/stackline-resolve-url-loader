'use strict';

var PACKAGE_NAME = require('../../package.json').name;

/**
 * Get an Error instance for the given message
 * @param {...*} message Any number of message arguments
 * @returns {Error}
 */
function getError() {
  var message = (PACKAGE_NAME + ':\n' + Array.prototype.slice.call(arguments).join(' '))
    .replace(/\s+/g, function (whitespace) {
      return whitespace.indexOf('\n') === -1 ? whitespace : '\n  ';
    });
  return new Error(message);
}

module.exports = getError;

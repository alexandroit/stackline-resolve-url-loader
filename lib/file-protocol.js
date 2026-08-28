/*
 * MIT License http://opensource.org/licenses/MIT
 * Author: Ben Holloway @bholloway
 */
'use strict';

/**
 * Prepend file:// protocol to source path string or source-map sources.
 */
function prepend(candidate) {
  if (typeof candidate === 'string') {
    return 'file://' + candidate;
  } else if (candidate && (typeof candidate === 'object') && Array.isArray(candidate.sources)) {
    return Object.assign({}, candidate, {
      sources: candidate.sources.map(prepend)
    });
  } else {
    throw new Error('expected string|object');
  }
}

exports.prepend = prepend;

/**
 * Remove file:// protocol from source path string or source-map sources.
 */
function remove(candidate) {
  // The optional second argument is an internal test seam. Reading it through
  // arguments preserves the upstream public arity of one.
  const platform = arguments.length > 1 ? arguments[1] : process.platform;
  if (typeof candidate === 'string') {
    const hadFileProtocol = /^file:\/{2}/.test(candidate);
    const withoutProtocol = candidate.replace(/^file:\/{2}/, '');

    // WHATWG-style Windows file URLs have three slashes: file:///D:/path.
    // Removing only `file://` leaves `/D:/path`, which is neither a Windows
    // absolute path nor a valid base for the default join implementation.
    // Restrict the correction to a leading drive-letter segment so ordinary
    // POSIX file URLs such as file:///work/input.scss retain their root slash.
    return (platform === 'win32') && hadFileProtocol && /^\/[A-Za-z]:[\\/]/.test(withoutProtocol) ?
      withoutProtocol.slice(1) : withoutProtocol;
  } else if (candidate && (typeof candidate === 'object') && Array.isArray(candidate.sources)) {
    return Object.assign({}, candidate, {
      sources: candidate.sources.map((source) => remove(source, platform))
    });
  } else {
    throw new Error('expected string|object');
  }
}

exports.remove = remove;

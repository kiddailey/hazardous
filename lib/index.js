'use strict';

const path  = require ('path');
const asar  = require ('asar');

const _path = {
  join:      path.join,
  normalize: path.normalize,
  resolve:   path.resolve
};
const hazarPath = {};

function hazardous (location) {
  /* We consider only absolute location, then it's possible to retrieve
   * the archive. With relative location, it's impossible to know if the
   * dir must be the caller __dirname or the current dir (cwd ()).
   */
  if (!path.isAbsolute (location)) {
    return location;
  }

  const matches = /(.*\.asar)[\\/](.*)/.exec (location);
  if (!matches) {
    return location;
  }

  const archive  = matches[1];
  const fileName = matches[2];

  try {
    const st = asar.statFile (archive, fileName, true);
    if (st.unpacked) {
      return location.replace (/\.asar([\\/])/, '.asar.unpacked$1');
    }
  } catch (ex) {}

  return location;
}

hazarPath.join = function () {
  return hazardous (_path.join.apply (this, arguments));
}

hazarPath.normalize = function () {
  return hazardous (_path.normalize.apply (this, arguments));
}

hazarPath.resolve = function () {
  return hazardous (_path.resolve.apply (this, arguments));
}

path.join      = hazarPath.join;
path.normalize = hazarPath.normalize;
path.resolve   = hazarPath.resolve;
var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var installer = require('lib/install');

const HAIBU_PATH_ON_DEVICE = '/data/local/haibu/apps/';

/**
 * Expose the root HDB.
 */

exports = module.exports = new HDB();

/**
 * Expose `HDB`.
 */

exports.HDB = HDB;

/**
 * Initialize a new `HDB`.
 *
 * @param {String} name
 * @api public
 */

function HDB() {
  this.pkgDir = path.dirname(require.main.filename) + '/.cache/';
  if (!fs.existsSync(this.pkgDir)) {
    fs.mkdirSync(this.pkgDir);
  }
}

HDB.prototype.install = function(options) {
  // console.log(JSON.stringify(options));
  switch (options.type) {
    case 'local':
      new installer.LocalRunnable(this).run(options);
      break;
    case 'git':
      new installer.GitRunnable(this).run(options);
      break;
    case 'zip':
      break;
  }
};

var fs = require('fs');
var path = require('path');
var shell = require('shelljs');

const HAIBU_PATH_ON_DEVICE = '/data/local/haibu/';

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

HDB.prototype.run = function(options) {
  // console.log(JSON.stringify(options));
  switch (options.type) {
    case 'local':
      new LocalRunnable(this).run(options);
      break;
    case 'git':
      new GitRunnable(this).run(options);
      break;
    case 'zip':
      break;
  }
};

function LocalRunnable(hdb) {
  this.hdb = hdb;
}

LocalRunnable.prototype.run = function(options) {
  var cmd = 'adb push ' + options.location + ' ' + HAIBU_PATH_ON_DEVICE;
  if (shell.exec(cmd).code !== 0) {
    console.error('Error: Push app failed');
    shell.exit(1);
  } else {
    console.log('Push app successfully!');
  }
};

function GitRunnable(hdb) {
  this.hdb = hdb;
}

GitRunnable.prototype.run = function(options) {
  var appName = parseAppNameFromGitUrl(options.location);
  var cmd = 'git clone ' + options.location + ' ' + this.hdb.pkgDir + appName;
  shell.exec('rm -rf ' + this.hdb.pkgDir + appName);
  if (shell.exec(cmd).code !== 0) {
    console.error('Error: Git clone failed');
    shell.exit(1);
  } else {
    new LocalRunnable().run({
      type: 'local',
      location: this.hdb.pkgDir + appName
    });
  }
};

/*
 * eg: https://github.com/Marak/hellonode.git
 *     'hellonode' should be returned
 */
function parseAppNameFromGitUrl(url) {
  var suffix = url.substr(url.lastIndexOf('/') + 1);
  return suffix.substr(0, suffix.lastIndexOf('.'));
}

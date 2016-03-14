var shell = require('shelljs');
var util = require('util');

const HAIBU_PATH_ON_DEVICE = '/data/local/haibu/apps/';

function InstallRunnable(hdb) {
  this.hdb = hdb;
}

InstallRunnable.prototype.run = function(options) {
};

function LocalRunnable(hdb) {
  InstallRunnable.call(this, hdb);
}

util.inherits(LocalRunnable, InstallRunnable);

LocalRunnable.prototype.run = function(options) {
  var cmd = 'adb push ' + options.location + ' ' +
    HAIBU_PATH_ON_DEVICE + options.name;
  if (shell.exec(cmd).code !== 0) {
    console.error('Error: Push app failed');
    shell.exit(1);
  } else {
    console.log('Push app successfully!');
  }
};

function GitRunnable(hdb) {
  InstallRunnable.call(this, hdb);
}

util.inherits(LocalRunnable, InstallRunnable);

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
      location: this.hdb.pkgDir + appName,
      name: appName
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

module.exports.LocalRunnable = LocalRunnable;
module.exports.GitRunnable = GitRunnable;
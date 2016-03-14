var haibu = require('haibu');

function Launcher() {
}

Launcher.prototype.launch = function(server, app) {
  // Create a new client for communicating with the haibu server
  var client = new haibu.drone.Client({
    host: server.address,
    port: server.port
  });

  // Attempt to start up a new application
  client.start(app, function (err, result) {
    if (err) {
      return console.error('Error spawning app: ' + app.name + ' -> ' + err);
    }
    console.log('Successfully spawned app:');
  });
};

module.exports.Launcher = Launcher;

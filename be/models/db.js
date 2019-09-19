var gracefulShutdown;
var mongoose = require('mongoose');
var colors = require('colors');
mongoose.Promise = global.Promise;

var db = mongoose.createConnection(process.env.MONGODB, {
  useMongoClient: true,
  promiseLibrary: global.Promise
});

// CONNECTION EVENTS
db.on('connected', function() {
  console.log(`Mongoose connected to ${process.env.MONGODB}`.green);
});

db.on('error', function(err) {
  console.log(`Mongoose connection error: ${err}`);
});

db.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
  db.close(function() {
    console.log(`Mongoose disconnected db through ${msg}`);
    callback();
  });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', function() {
    process.exit(0);
  });
});

module.exports = db;

// BRING IN YOUR SCHEMAS & MODELS
require('./items');
require('./cart');
require('./sales');

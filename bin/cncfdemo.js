#!/usr/bin/env node

/*
 * Module dependencies.
 */

var app = require('../main');
var cluster = require('cluster');
var http = require('http');
var https = require('https');
var numCPUs = require('os').cpus().length;
var fs = require('fs');

/*
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.argv[2] || 4000);
app.set('port', port);
const ip = 'localhost';

if (cluster.isMaster) {
    fs.writeFile("/tmp/cncfdemo.pid", process.pid, function(err) {
        if (err) {
            console.log('cannot write pid');
            process.exit(1);
        }
    });

    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // If a worker dies, log it to the console and start another worker.
    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died.');
        cluster.fork();
    });

    // Log when a worker starts listening
    cluster.on('listening', function(worker, address) {
        console.log('Worker started with PID ' + worker.process.pid + '.');
    });

} else {
    /**
     * Create HTTP(s) server.
     */

    // var server = https.createServer(cert,  app);
    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    //  server.listen(port, ip);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    server.timeout = 10 * 60 * 1000; // 10 minutes
}

/*
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/*
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = this.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    console.log('Listening on ' + bind);
}

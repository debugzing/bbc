#!/usr/bin/node

var express = require('express');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var compression = require('compression');
var router = express.Router();
var util = require('util');
var async = require('async');
var app = express();
var client = require('prom-client');
var db = require('./be/models/db');
var Sales = db.model('Sales');
var Items = db.model('Items');

app.use(compression());
app.use(logger('combined'));
app.use(bodyParser.json());
app.use('/', router);

app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));

const metrics_prefix = 'cncfdemo_';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({
    timeout: 5000,
    prefix: metrics_prefix
});

const salescounter = new client.Gauge({
    name: `${metrics_prefix}salesvalue`,
    help: 'total value of sales in base currency'
});

const numsalescounter = new client.Gauge({
    name: `${metrics_prefix}numberofsales`,
    help: 'total number of sales'
});

const uniqueitems = new client.Gauge({
    name: `${metrics_prefix}uniqueitems`,
    help: 'number of unique item types'
});

let itemsgauge = {};
let stockcount = {};

router.get('/metrics', function(req, res) {
    Items.find({}, function(err, items) {
        let uniqi = _.uniq(_.map(items, 'type'));
        uniqueitems.set(uniqi.length);

        async.each(uniqi, function(i, cb) {

            if (itemsgauge[i]) {
                itemsgauge[i].set(_.filter(items, { type: i }).length);
            } else {
                itemsgauge[i] = new client.Gauge({ name: `${metrics_prefix}num_${i}`, help: `number of unique ${i} in stock` });
                itemsgauge[i].set(_.filter(items, { type: i }).length);
            }

            if (stockcount[i]) {
                stockcount[i].set(_.filter(items, { type: i }).length);
            } else {
                stockcount[i] = new client.Gauge({ name: `${metrics_prefix}stock_${i}`, help: `total stock of ${i}` });
                stockcount[i].set(_.sum(_.map(_.filter(items, { type: i }), 'stockcount')));
            }
            cb();
        }, function() {

            Sales.find({}, function(err, sales) {
                if (err) {
                    return res.status(200).end();
                }
		numsalescounter.set(sales.length);
                salescounter.set(_.sum(_.map(sales, 'price')));
                return res.status(200).send(client.register.metrics()).end();
            });
        });
    });
})


//Start server
var port = process.argv[2];
if (port == undefined) {
    console.log("Please specify PORT")
    process.exit(1);
}

var server = app.listen(port);
server.on('error', onError);
server.on('listening', onListening);

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

function onListening() {
    var addr = this.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    console.log('Metrics listening on port %d', port);
}

#!/usr/bin/node

var items = require(process.argv[2]);
var db = require('./be/models/db');
var Items = db.model('Items');
var Cart = db.model('Cart');
var Sales = db.model('Sales');
var async = require('async');
var path = require('path');

async.each(items, function(item, cb) {
    Items.findOne({ id: item.id }, function(err, i) {
        if (err || i == null) {
            // item is not in db so we add it
            Items.create(item, function(err, it) {
                if (err) {
                    cb('error');
                }
                console.log(`Adding `,it.id, it.name);
                cb();
            });
        } else {
	    // Don't replace item
	    cb()
	}
    })
}, function(err) {
    console.log('done', err || '');
    db.close();
});

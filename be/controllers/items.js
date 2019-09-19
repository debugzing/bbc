var db = require('../models/db');
var Items = db.model('Items');
var Cart = db.model('Cart');
var async = require('async');

module.exports.getitems = function(req, res) {
    Items.find({}).sort("id").exec(function(err, items) {
    if (err) {
      console.log(err);
      return res.status(400).json({}).end();
    } else {
      return res.status(200).json({
        items: items
      }).end();
    }
  });
};

module.exports.deleteall = function(req, res) {
    Items.remove({}, function(err, items) {
      console.log("deleted all stock items");
      return res.status(200).json({}).end();
  });
};

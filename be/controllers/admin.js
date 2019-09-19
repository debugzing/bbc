var db = require('../models/db');
var Items = db.model('Items');
var Cart = db.model('Cart');
var async = require('async');

module.exports.restock = function(req, res) {
  Items.find({}, function(err, items) {
    async.each(items, function(item, cb) {
      var count = req.params.count ? req.params.count : (1 + Math.floor(Math.random() * 50));
      item.update({ $set: { stockcount: count } }, function() {
        console.log('restock', item.name, count);
        cb();
      });
    }, function(err) {
      return res.status(200).json({}).end();
    });
  });
}

module.exports.clearcarts = function(req, res) {
  Cart.remove({}, function(err) {
    if (err) {
      return res.status(400).json({}).end();
    }
    return res.status(200).json({}).end();
  });
}

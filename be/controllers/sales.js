var db = require('../models/db');
var Sales = db.model('Sales');

module.exports.get = function(req, res) {
  Sales.find({}, function(err, sales) {
    if (err) {
      return res.status(400).json({}).end();
    }
    return res.status(200).json(sales).end();
  })
}

var db = require('../models/db');
var Cart = db.model('Cart');
var Items = db.model('Items');
var Sales = db.model('Sales');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');

module.exports.pay = function(req, res) {
    var cartid = req.headers.cartid;
    if (cartid) {
        Cart.findOne({
            _id: cartid
        }).populate('items.item').exec(function(err, cart) {
            if (err) {
                console.log('pay error', err);
                return res.status(400).json({}).end();
            } else {
                if (cart == null || cart.items.length == 0) {
                    console.log('trying to pay for empty cart');
                    return res.status(400).json({}).end();
                } else {

                    async.eachSeries(cart.items, function(item, cb) {
                        if (item.item.stockcount == 0) {
                            cb({
                                message: `Stock of your item ${item.item.name} ${item.item.model} has run out`,
                                item: item.item
                            });
                            //cb(`Stock of your item ${item.item.name} ${item.item.model} has run out`);
                        } else {
                            if (item.item.stockcount - item.count < 0) {
                                cb({
                                    message: `Not enough stock of some of the item in your cart`,
                                    item: item.item
                                });
                            } else {
                                Items.update({
                                    _id: item.item._id
                                }, {
                                    $inc: {
                                        stockcount: -item.count
                                    }
                                }, function() {
                                    async.times(item.count, function(n, salescb) {
                                        Sales.create({
                                            type: item.item.type,
                                            name: item.item.name,
                                            currency: item.item.currency,
                                            price: item.item.price
                                        }, function(err) {
                                            salescb(err);
                                        })
                                    }, function(err) {
                                        if (err) {
                                            console.log('sales update err', err);
                                        }
                                        cb();
                                    });
                                });
                            }
                        }
                    }, function(err) {
                        if (err) {
                            // Rollback
                            async.eachSeries(cart.items, function(item, rollbackcb) {
                                if (item.item == err.item) {
                                    rollbackcb('done');
                                } else {
                                    Items.update({
                                        _id: item.item._id
                                    }, {
                                        $inc: {
                                            stockcount: item.count
                                        }
                                    }, function() {
                                        rollbackcb();
                                    });
                                }
                            }, function() {
                                console.log('pay ->', err.message);
                                return res.status(400).json({
                                    message: err.message
                                }).end();
                            });
                        } else {
                            Cart.update({
                                _id: cartid
                            }, {
                                $set: {
                                    items: []
                                }
                            }, function(err) {
                                return res.status(200).json({}).end();
                            });
                        }
                    });
                }
            }
        });
    } else {
        return res.status(400).json({}).end();
    }
}

module.exports.getcart = function(req, res) {
    var cartid = req.headers.cartid;

    var newcart = function() {
        return new Promise(function(resolve, reject) {
            Cart.create({}, function(err, cart) {
                if (err) {
                    reject(err);
                } else {
                    resolve(cart._id);
                }
            });
        });
    }

    console.log("Search for cartid", cartid);
    if (cartid) {
        Cart.findOne({ _id: cartid }).populate('items.item').exec(function(err, cart) {
            console.log("Look for cartid", cartid, "returned cart ->", cart);

            if (err) {
                return res.status(400).json({}).end();
            } else {
                if (cart == null) {
                    newcart().then(function(cid) {
                        console.log('Sending new cart  ->', cid);
                        return res.status(200).json({ cartid: cid, items: [] }).end();
                    }).catch(function(err) {
                        return res.status(400).json({}).end();
                    });
                } else {
                    console.log('Sending old cartid', cartid, cart);
                    return res.status(200).json({ cartid: cart._id, items: cart.items }).end();
                }
            }
        });
    } else {
        newcart().then(function(cid) {
            console.log('Sending new cartx ->', cid);
            return res.status(200).json({ cartid: cid, items: [] }).end();
        }).catch(function(err) {
            return res.status(400).json({}).end();
        });
    }
}

module.exports.addtocart = function(req, res) {
    var cartid = req.headers.cartid;
    if (req.body.item == undefined || req.body.item == null) {
        return res.status(400).json({}).end();
    }

    console.log('addtocart', cartid, req.body.item);
    if (cartid) {
        Items.findOne({
            _id: req.body.item
        }, function(err, item) {
            if (err || item == null) {
                console.log('addtocard failed', err, item ? item : 'null item');
                return res.status(400).json({}).end();
            }
            Cart.findOne({ _id: cartid }).populate('items.item').exec(function(err, cart) {
                if (err || cart == null) {
                    console.log('addtocard failed', err, cart ? cart : 'null cart');
                    return res.status(400).json({}).end();
                }
                var i = _.find(cart.items, (it) => it.item._id == req.body.item);
                console.log('find ', req.body.item, 'in', cart.items, 'found ->', i || 'false');
                if (i) {
                    if (i + 1 > item.stockcount) {
                        return res.status(400).json({ code: 1001 }).end();
                    }
                    i.count++;
                } else {
                    cart.items.push({ count: 1, item: item });
                }

                cart.save(function(err, result) {
                    if (err) {
                        console.log('addtocart error when saving cart', err);
                        return res.status(400).json({}).end();
                    } else {
                        return res.status(200).json(cart).end();
                    }
                });
            });
        });
    } else {
        return res.status(400).json({}).end();
    }
}

module.exports.removefromcart = function(req, res) {
    var cartid = req.headers.cartid;
    console.log('removefromcart', cartid, req.params.id);

    if (req.params.id == undefined || req.params.id == null) {
        return res.status(400).json({}).end();
    }
    if (cartid) {
        Items.findOne({
            _id: req.params.id
        }, function(err, item) {
            if (err || item == null) {
                console.log('removefromcart failed', err, item ? item : 'null item');
                return res.status(400).json({}).end();
            }
            Cart.findOne({ _id: cartid }).populate('items.item').exec(function(err, cart) {
                if (err || cart == null) {
                    console.log('removefromcart failed', err, cart ? cart : 'null cart');
                    return res.status(400).json({}).end();
                }
                var i = _.find(cart.items, (it) => it.item._id == req.params.id);
                console.log('find ', req.params.id, 'in', cart.items, 'found ->', i || 'false');
                if (i) {
                    if (i.count > 1) {
                        i.count--;
                    } else {
                        _.remove(cart.items, (it) => it.item._id == req.params.id);
                        cart.markModified('items');
                    }
                } else {
                    console.log('removefromcart failed. cannot find item', req.params.id, 'in your cart', cart);
                    return res.status(400).json({}).end();
                }
                console.log('remove from cart ->', cart);
                cart.save(function(err, result) {
                    console.log(err, result);
                    if (err) {
                        return res.status(400).json({}).end();
                    } else {
                        return res.status(200).json(cart).end();
                    }
                });
            });
        });
    } else {
        return res.status(400).json({}).end();
    }
}

module.exports.clearcart = function(req, res) {
    var cartid = req.headers.cartid;
    if (cartid) {
        Cart.update({ _id: cartid }, { $set: { items: [] } }, function(err, result) {
            if (err) {
                return res.status(400).json({}).end();
            } else {
                return res.status(200).json({}).end();
            }
        })
    } else {
        return res.status(400).json({}).end();
    }
}

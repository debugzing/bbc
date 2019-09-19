#!/usr/bin/node

var request = require('request');
var _ = require('lodash');

request.get(process.argv[2] + '/api/getitems', function(err, res, body) {
    var json = JSON.parse(body);
    var instock = _.filter(json.items, (it) => it.stockcount > 0);

    if (!instock.length) {
        console.log("no stock to buy");
        process.exit(1);
    }

    var itemtobuy = _.shuffle(instock)[0];

    request(process.argv[2] + '/api/getcart', function(err, res, body) {
        var json = JSON.parse(body);

        if (res.statusCode == 200) {
            request.put(process.argv[2] + '/api/addtocart', {
                headers: {
                    cartid: json.cartid
                },
                json: {
                    item: itemtobuy._id
                }
            }, function(err, res, body) {
                if (res.statusCode == 200) {
                    request.get(process.argv[2] + '/api/pay', {
                        headers: {
                            cartid: json.cartid
                        }
                    }, function(err, res, body) {
                        if (res.statusCode == 200) {
                            console.log(`bought a ${itemtobuy.name} for ${itemtobuy.currency} ${itemtobuy.price}`);
                        } else {
                            console.log("purchase failed. API returned", res.statusCode);
                        }
                    });
                }
            });
        }

    });
});
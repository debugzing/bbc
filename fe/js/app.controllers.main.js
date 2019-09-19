function mainCtrl($scope, $state, $cookies, api, data) {
    var main = this;

    main.state = $state;
    var cartid = $cookies.get('cartid');

    main.items = null;
    main.cart = data.getcart();
    main.message = data.getmessage();

    main.cartcount = function() {
        /*
		var count = 0;
		console.log('cartcount', main.cart);
		_.each(main.cart, function(i) {
			console.log('sum->', i.count);
			count+= (i.count||0);
		})
		console.log('return', count);
		return count;
	    */
        return _.sumBy(main.cart, 'count');
    }
    if (cartid == undefined) {
        console.log('no cartid');
        api.getcart().then(function(res) {
            data.putcartid(res.data.cartid);
            $cookies.put('cartid', res.data.cartid);
            data.putcart(res.data.items);
            console.log('created new cartid', res.data.cartid);
        }, function(err) {
            console.log('err'.res);
        });
    } else {
        console.log('getting cart for id', cartid);
        data.putcartid(cartid);
        api.getcart(cartid).then(function(res) {
            data.putcartid(cartid);
            $cookies.put('cartid', res.data.cartid);
            data.putcart(res.data.items);
        }, function(err) {
            console.log(err, res);
        });
    }

    api.getitems(cartid).then(function(res) {
        data.putitems(res.data.items);
        main.items = res.data.items;
        main.itemcat = _.uniq(_.map(main.items, 'type'));
    }, function(err) {
        console.log('err', res);
    });
}

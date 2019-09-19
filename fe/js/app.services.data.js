function data($timeout) {
	_cartid = 0;

	var message = {};
	var items = [];
	var cart = [];

	var getitems = function() {
		return items;
	}

	var putitems = function(_items) {
		_.remove(items);
		_.each(_items, function(_i) { items.push(_i) });
	}

	var getcart = function() {
		return cart;
	}

	var putcart = function(_items) {
		_.remove(cart);
    _.each(_items, function(_i) {
      cart.push(_i);
    });
	}

	var getcartid = function() {
		return _cartid;
	}

	var putcartid = function(id) {
		_cartid = id;
	}

	var getmessage = function() {
		return message;
	}

	var postmessage = function(msg, type) {
		message.class = type ? `alert-${type}`: "alert-success";
		message.txt = msg
		$timeout(()=> { message.txt="" }, 5000);
	}

	return {
		postmessage: postmessage,
		getmessage: getmessage,

		getitems: getitems,
		putitems: putitems,

		putcart: putcart,
		getcart: getcart,

		putcartid: putcartid,
		getcartid: getcartid,
	}
}

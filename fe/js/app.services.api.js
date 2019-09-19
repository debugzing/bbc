api.$inject = ['$http'];

function api($http, cartid) {
	var getcart = function(cartid) {
		return $http.get('/api/getcart', {
			headers: {
				cartid: cartid
			}
		});
	}

	var addtocart = function(cartid, item) {
		return $http.put('/api/addtocart', {
			item: item._id
		}, {
			headers: {
				cartid: cartid
			}
		});
	}

	var removefromcart = function(cartid, item) {
		return $http.delete('/api/removefromcart/' + item._id, {
			headers: {
				cartid: cartid
			}
		});
	}

	var deleteall = function() {
		return $http.get('/api/deleteall');
	}
    
	var clearcart = function(cartid) {
		return $http.get('/api/clearcart', {
			headers: {
				cartid: cartid
			}
		});
	}

	var pay = function(cartid) {
		return $http.get('/api/pay', {
			headers: {
				cartid: cartid
			}
		});
	}

	var getitems = function(cartid) {
		return $http.get('/api/getitems', {
			headers: {
				cartid: cartid
			}
		});
	}

	var getsales = function() {
		return $http.get('/api/sales');
	}

	var clearcarts = function() {
		return $http.get('/api/admin/clearcarts');
	}

	var restock = function(count) {
		return $http.get(count ? `/api/admin/restock/${count}` : '/api/admin/restock');
	}

	return {
		getsales: getsales,
		clearcarts: clearcarts,
		restock: restock,

	        getitems: getitems,
	        deleteall: deleteall,
	    
		getcart: getcart,
		addtocart: addtocart,
		removefromcart: removefromcart,
		clearcart: clearcart,
		pay: pay
	}
}

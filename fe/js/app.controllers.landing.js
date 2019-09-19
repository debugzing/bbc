function landingCtrl($scope, $window, $state, $cookies, $timeout, $translate, api, data) {
	var vm = this;

	vm.state = $state;

	console.log('executing landing ctrl', vm.state.params.item);

	vm.itemtype = { item: vm.state.params.item };
	vm.cartid = data.getcartid();
	vm.items = data.getitems();
	vm.cart = data.getcart();
	var message = data.getmessage();

	vm.addtocart = function(item) {
		console.log('vm.addtocart', item.name);
		api.addtocart(vm.cartid, item).then(function(res) {
			data.putcart(res.data.items);
		}, function(err) {
			data.postmessage($translate.instant('ADD_TO_CART_FAILED'), "danger");
			console.log('error adding item to cart');
		});
	}
}

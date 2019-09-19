function cartCtrl($scope, $window, $state, $cookies, $timeout, api, data, $uibModal, $translate) {
	var vm = this;

	vm.state = $state;
	console.log('executing cart ctrl');
	vm.cartid = data.getcartid();
	vm.items = data.getitems();
	vm.cart = data.getcart();
	var message = data.getmessage();

	vm.count = { count: vm.cart.length };

	var alert = function(msg, showconfirm) {
		var modalInstance = $uibModal.open({
			templateUrl: '/views/alert-confirm.html',
			backdrop: "static",
			keyboard: false,
			controllerAs: "$ctrl",
			controller: function() {
				this.message = msg;
				this.showconfirm = showconfirm;
			}
		})
		return modalInstance;
	}

	vm.sum = function() {
		vm.total = 0;
		_.each(vm.cart, function(item) {
			vm.total += item.item.price * item.count;
		})
		return vm.total;
	}

	vm.addtocart = function(item) {
		api.addtocart(vm.cartid, item).then(function(res) {
      console.log('vm.addtocart', res.data);
			data.putcart(res.data.items);
			console.log(res.data.items);
		}, function(err) {
			data.postmessage($translate.instant('ADD_TO_CART_FAILED'), "danger");
			console.log('error adding item to cart');
		});
	}

	vm.removefromcart = function(item) {
		var modal = alert($translate.instant('REMOVE_FROM_CART_MODAL'), true);
		modal.result.then(function(res) {
			if (res == 'ok') {
				api.removefromcart(vm.cartid, item).then(function(res) {
					data.putcart(res.data.items);
				}, function(err) {
					data.postmessage($translate.instant('REMOVE_FROM_CART_FAILED'), "danger");
					console.log('error removing item from cart');
				});
			}
			modal.close();
		});
	}

	vm.clearcart = function(item) {
		var modal = alert($translate.instant('CLEAR_CART_MODAL'), true);
		modal.result.then(function(res) {
			if (res == 'ok') {
				api.clearcart(vm.cartid).then(function(res) {
					data.putcart();
				}, function(err) {
					data.postmessage($translate.instant('CLEAR_CART_FAILED'), "danger");
					console.log('error clearing cart');
				});
			}
			modal.close();
		});
	}

	vm.pay = function() {
		var modal = alert($translate.instant('PAY_NOW_MODAL'), true);
		modal.result.then(function(res) {
			if (res == 'ok') {
				api.pay(vm.cartid).then(function(res) {
					var modal2 = alert($translate.instant('PAID_MESSAGE_MODAL', { amount: vm.total }));
					_.each(vm.cart, function(item) {
					  var it = _.find(vm.items, {_id: item.item._id});
						it.stockcount -= item.count;
					});
					data.putcart();
				}, function(err) {
					data.postmessage($translate.instant('PAY_FAILED'), "danger");
					console.log('error paying');
				});
			}
			modal.close();
		});
	}
}

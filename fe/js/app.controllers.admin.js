function adminCtrl($scope, $window, $state, $cookies, $timeout, $translate, api, data) {
	var vm = this;

	vm.state = $state;

	console.log('executing admin ctrl');
	vm.message = data.getmessage();

	vm.deleteall = function() {
		api.deleteall();
		data.postmessage("All stock items deleted");
	}
    
	vm.clearcarts = function() {
		api.clearcarts();
		data.postmessage("Carts cleared");
	}

	vm.restock = function(count) {
		/*
		if (count && !(Number(parseFloat(count)) === count)) {
			data.postmessage("Bad restock count", "danger");
			return;
		}*/
		api.restock(count).then(function(res) {
			if (count) {
				data.postmessage(`Restocked with ${count} items`);
			} else {
				data.postmessage("Restocked");
			}
		}, function(err) {
			data.postmessage("Restock failed", "danger");
		})
	}
}

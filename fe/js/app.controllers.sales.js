function salesCtrl($scope, $window, $state, $cookies, $timeout, $translate, api, data) {
	var vm = this;

	vm.state = $state;

	console.log('executing sales ctrl');
	vm.message = data.getmessage();

	api.getsales().then(function(res) {
		vm.sales = res.data;
		vm.total = _.sumBy(res.data, 'price');
	}, function(err) {
		data.message("Get sales failed");
	});
}

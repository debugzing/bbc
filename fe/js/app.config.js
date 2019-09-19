function config($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider) {

	// Translation
	$translateProvider.useStaticFilesLoader({
		prefix: '/lang/messages_',
		suffix: '.json'
	});
	$translateProvider.preferredLanguage('en');
	$translateProvider.useSanitizeValueStrategy('sanitize');

	//$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('landing', {
			abstract: true,
			templateUrl: "views/common.html",
		})
		.state('landing.home', {
			url: "/",
			templateUrl: "views/home.html",
			params: { item: null },
			controller: 'landingCtrl',
			controllerAs: 'vm',
			data: {
				pageTitle: 'Home',
			}
		})
		.state('landing.detail', {
			url: "/detail",
			templateUrl: "views/detail.html",
			params: { item: null },
			controller: 'landingCtrl',
			controllerAs: 'vm',
			data: {
				pageTitle: 'Details',
			}
		})
		.state('landing.cart', {
			url: "/cart",
			templateUrl: "views/cart.html",
			controller: 'cartCtrl',
			controllerAs: 'vm',
			data: {
				pageTitle: 'Cart',
			}
		})
		.state('internal', {
			url: "/internal",
			abstract: true,
			templateUrl: "views/internal.html",
		})
		.state('internal.admin', {
			url: "/admin",
			templateUrl: "views/admin.html",
			controller: 'adminCtrl',
			controllerAs: 'vm',
			data: {
				pageTitle: 'Admin',
			}
		})
		.state('internal.sales', {
			url: "/sales",
			templateUrl: "views/sales.html",
			controller: 'salesCtrl',
			controllerAs: 'vm',
			data: {
				pageTitle: 'Sales',
			}
		})
		.state('404', {
			url: "/404",
			templateUrl: "static/404.html",
			doNotTrack: true,
			data: {
				pageTitle: '404 Page Not Found',
				specialClass: 'gray-bg'
			},
		})
}

angular
	.module('cncfdemo')
	.config(config)
	.run(function($rootScope, $state, $window, $cookies, $timeout, $transitions) {

		$rootScope.$state = $state;
		$transitions.onStart({}, function(trans) {
			const data = trans.to().data;
			if (data && data.pageTitle) {
				$timeout(function() {
					angular.element('title').text(`CNCF Demo | ${data.pageTitle}`);
				});
			}
		});

		$transitions.onStart({}, function(trans) {})

		$transitions.onError({}, function(trans) {
			const error = trans.error();
			console.log('got an error', error);

			if (error.detail == "expired") {
				expired();
			};

			if (error.detail == "not found") {
				$state.go('404');
			};
		});

	});

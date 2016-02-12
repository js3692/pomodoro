app.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('dashboard', {
		url: '/dashboard',
		templateUrl: 'js/dashboard/dashboard.html',
  	data: {
    	authenticate: true
  	},
		controller: function ($scope, Session) {
			$scope.user = Session.user;
		}
	});
}]);
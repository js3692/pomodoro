app.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('signup', {
    url: '/signup',
    templateUrl: 'js/signup/signup.html',
    controller: function (AuthService, $scope, $state) {
    	$scope.loading = false;
			$scope.error = null;

			$scope.signup = function (credentials) {
				if($scope.error) $scope.error = null;
				$scope.loading = true;
				AuthService.signup(credentials)
					.then(function () {
						if(credentials.firstName) delete credentials.firstName;
						if(credentials.lastName) delete credentials.lastName;
						return AuthService.login(credentials);
					})
					.then(function () {
						$scope.loading = false;
						$state.go('dashboard');
					})
					.catch(function (err) {
						$scope.loading = false;
						$scope.error = err.message;
					});
			}
    }
  });
}]);
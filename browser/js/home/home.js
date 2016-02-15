app.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('home', {
		url: '/',
		templateUrl: 'js/home/home.html',
		resolve: {
      returning: function (AuthService) {
        return AuthService.getLoggedInUser();
      }
    },
		controller: function (returning, AuthService, $scope, $state) {
			console.log(returning)
			$scope.returning = returning;
			$scope.enter = function () {
				$state.go('dashboard');
			}

			$scope.loading = false;
			$scope.error = null;

			$scope.login = function (credentials) {
				if($scope.error) $scope.error = null;
				$scope.loading = true;
				AuthService.login(credentials)
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
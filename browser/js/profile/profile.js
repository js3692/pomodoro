app.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('profile', {
    url: '/profile',
    templateUrl: 'js/profile/profile.html',
  	data: {
    	authenticate: true
  	}
  });
}]);
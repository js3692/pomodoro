'use strict';

window.app = angular.module('Pomodoro', [
  'AuthControl',
  'ui.router',
  'ui.bootstrap',
  'ngAnimate',
  'angularSpinner'
]);

app.config(['$urlRouterProvider', '$locationProvider', function ($urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
}]);

app.run(['$rootScope', 'AuthService', '$state', function ($rootScope, AuthService, $state) {

  var destinationStateRequiresAuth = function (state) {
    return state.data && state.data.authenticate;
  };

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

    if (!destinationStateRequiresAuth(toState)) return;

    if (AuthService.isAuthenticated()) return;

    event.preventDefault();

    AuthService.getLoggedInUser().then(function (user) {
      if (user) $state.go(toState.name, toParams);
      else $state.go('home');
    });
  });

}]);
app.directive('authStatus', function ($rootScope, AuthService, AUTH_EVENTS, $state) {
  return {
    restrict: 'E',
    link: function (scope) {
      scope.user = null;

      console.log("I'm alive")

      scope.isLoggedIn = function () {
        return AuthService.isAuthenticated();
      };

      scope.logout = function () {
        AuthService.logout().then(function () {
          $state.go('home');
        });
      };

      var setUser = function () {
        AuthService.getLoggedInUser().then(function (user) {
          scope.user = user;
        });
      };

      var removeUser = function () {
        scope.user = null;
      };

      setUser();

      $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
      $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
      $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
    }
  };
});
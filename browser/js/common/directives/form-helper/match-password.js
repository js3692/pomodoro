app.directive('matchPassword', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      ctrl.$validators.matchPassword = function (modelValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }

        // Validate password confirmation fields
        if (scope.credentials.password) {
          return scope.credentials.password === modelValue;
        }

        return false;
      };
    }
  };
});
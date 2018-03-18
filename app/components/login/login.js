'use strict';

angular.module('myApp.login', ['ngRoute', 'ngResource', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'components/login/login.html',
    controller: 'LoginCtrl'
  });
}])
.controller('LoginCtrl', ['$scope', '$resource', '$location', '$cookies', 'sessionService', 'apiService', function($scope, $resource, $location, $cookies, sessionService, apiService) {    
  if (!sessionService.isTokenExpire()) {
    $location.path('/home')
  }

  $scope.email = ''
  $scope.password = ''
  $scope.errorMessage

  $scope.login =  function (formValid) {
    if (formValid) {
    var Login = apiService.login()
        Login.save({email: $scope.email , password: $scope.password})
          .$promise.then (
            function(response) {
              if (response.access_token != null ) {
                $cookies.put('token', response.access_token)     
                $location.path("/home")
            }
          },
          function(error) {
            $scope.errorMessage = 'Invalid Credentials'
          })
    }
  }
}]);
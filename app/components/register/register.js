'use strict';

angular.module('myApp.register', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider, $resource) {
  $routeProvider.when('/register', {
    templateUrl: 'components/register/register.html',
    controller: 'RegisterCtrl'
  });
}])
.factory('registerService', ['$resource', '$location', '$cookies', 'apiService', function($resource, $location, $cookies, apiService){
    return {
        login: function (params) {
            var Login = apiService.login()
                Login.save({email: params.email , password: params.password})
                .$promise.then (
                function(response) {
                        if (response.access_token != null ) {
                        $cookies.put('token', response.access_token)
                        $location.path("/home")
                    }
                })
        }
    }
}])
.controller('RegisterCtrl', ['$scope', '$resource', '$location', 'sessionService', 'apiService', 'registerService', function($scope, $resource, $location, sessionService, apiService, registerService) {
    if (!sessionService.isTokenExpire()) {
        $location.path('/home')
    }
    
    $scope.name
    $scope.email
    $scope.password
    $scope.processing
    $scope.errorMessage

    $scope.register =  function (formValid) {
        $scope.errorMessage = ''
        if (formValid) {
            $scope.processing = 'Processing....'
            var Register = apiService.register()
                Register.save({name: $scope.name, email: $scope.email, password: $scope.password},
                    function (response) {
                        var params = {
                            email: $scope.email,
                            password: $scope.password
                        }

                        // Since we got nothing except response header and status
                        registerService.login(params)
                    },
                    function(error) {
                        $scope.processing = ''
                        switch(error.data.error_code){
                            case 101:
                                $scope.errorMessage = 'Email already taken'
                            break;
                            default:
                                $scope.errorMessage = 'Error occured'
                        }
                    }
                ) 
        }
    }
}]);
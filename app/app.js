'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'ngCookies',
  'ngStorage',
  'myApp.login',
  'myApp.home',
  'myApp.register',
  'myApp.profile',
  'myApp.topnav',
  'myApp.accountdetail'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {  
  $routeProvider.otherwise({redirectTo: '/login'});
}])
.factory('sessionService', ['$cookies', '$resource', '$localStorage', '$location', 'apiService', function ($cookies, $resource, $localStorage, $location, apiService) {
  var token = $cookies.get('token'),
      Profile = apiService.profile()

  var methods = {
      isLoggedin: function () { // Check if user is logged in
          token = $cookies.get('token')
          return token != null;
      },
      isTokenExpire: function () {
          if (this.isLoggedin()) {
            var response = Profile.get({token: token})
                           .$promise.then(function(response) {
                              // If we get return, then token still valid
                              return response.name == null
                           })
          } else {
            return true
          }
      },
      logout: function () {
        $cookies.remove('token')
        console.log('Ensure cookies removed')
        console.log($cookies.get('token'))
        console.log('/Ensure cookies removed')
        $localStorage.$reset()
        $location.path('/login')
      },
      getProfile: function (cb) {
          var token = $cookies.get('token')
          if (token != '') {       
            Profile.get({token: token}).$promise.then(
              function(success){
                cb(success)                
              },
              function(error){
                switch(error.status){
                  case 401:
                    methods.logout()
                  break;
                  default:
                    return error
                }
              })      
          }
          return false
      }
    }

    return methods
}])
.factory('apiService', ['$cookies', '$resource', '$http', '$location', function ($cookies, $resource, $http, $location) {
  var token = $cookies.get('token')

  return {
      login: function (cb) {
        return $resource(apiConfig.baseURL + 'auth/token')
      },
      profile: function (cb) {
        return $resource(apiConfig.baseURL + 'info?token=:token', {token: '@token'})
      },
      register: function (cb) {
        return $resource(apiConfig.baseURL + 'register')
      },
      accounts: function (cb) {
        return $resource(apiConfig.baseURL + 'accounts?token=:token', {token: '@token'})
      },
      accountHistory: function (cb) {
        return $resource(apiConfig.baseURL + 'account/:accountNum/transactions?token=:token', {accountNum: '@accountNum', token: '@token'})
      }
    }
}])
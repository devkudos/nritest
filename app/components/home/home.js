'use strict';

angular.module('myApp.home', ['ngRoute', 'ngTable', 'ngResource', 'ngCookies', 'ngStorage'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'components/home/home.html',
    controller: 'HomeCtrl'
  });
}])
.factory('accountService', ['$cookies', '$resource', '$http', '$rootScope', '$localStorage', 'apiService',  function ($cookies, $resource, $http, $rootScope, $localStorage, apiService) {
  var accountNum,
      token = $cookies.get('token'),
      accounts = $localStorage.accounts,
      accountInfo

  return {
      accounts: function (cb) {
        var token = $cookies.get('token'),
            Accounts = apiService.accounts(),
            data = Accounts.query({token: token})
                           .$promise.then(function(result) {
                              cb(result)
                            })
      },
      accountsData: function(data) {
        accounts = $localStorage.accounts
      },
      accountInfo: function(data) {        
        var accounts = $localStorage.accounts
            accounts.forEach(function(item) {
              if (item.number == data) {
                $localStorage.accountInfo = item
                accountInfo = item
              }
            })

        return accountInfo
      }
    }
}])
.controller('HomeCtrl', ['$scope', '$rootScope', '$localStorage', '$cookies', 'NgTableParams', '$location', 'sessionService', 'accountService', function ($scope, $rootScope, $localStorage, $cookies, NgTableParams, $location, sessionService, accountService) {
  // Check session
  if (sessionService.isTokenExpire()) {  
    $location.path('/login')
  }

  $scope.logout = function () {
    sessionService.logout()
  }
  
  var no = 1
  $scope.accounts = ''
  
  // Get accounts data
  accountService.accounts(function(result){
    var storage = $localStorage
    $scope.accounts = result    

    $scope.accounts.forEach(function(item){
      item.no = no
      no++
    })

    $scope.tableParams = new NgTableParams({}, { dataset: $scope.accounts });
    
    accountService.accountsData($scope.accounts)
    
    storage.accounts =  $scope.accounts
    $rootScope.accounts = storage.accounts
  })
    
}])
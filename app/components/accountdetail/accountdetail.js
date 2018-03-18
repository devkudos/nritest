'use strict';

angular.module('myApp.accountdetail', ['ngRoute', 'ngTable'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/account/:accountNum', {
    templateUrl: 'components/accountdetail/accountdetail.html',
    controller: 'AccountDetailCtrl'
  })
}])
.factory('historyService', ['apiService', '$cookies', function (apiService, $cookies){
  return {
    accountHistory: function (cb, param) {
      var token = $cookies.get('token'),
          Account = apiService.accountHistory()
          Account.query({token: token, accountNum: param})
                 .$promise.then(function(result) {
                  cb(result)
          })
    },
    getBalance: function (transactions) {
        var payment = 0, deposit = 0, withdrawal = 0, balance, sum = {}, count = 1
        transactions.forEach(function(item) {
          switch(item.type){
            case 'payment':
              payment = Number(payment, 2) + Number(item.amount, 2)
              break;
            case 'deposit':
              deposit = Number(deposit, 2) + Number(item.amount, 2)
              break;
            case 'withdrawal':
              withdrawal = Number(withdrawal,2) + Number(item.amount, 2)
              break;
          }
          count++
        })

        sum.payment = payment
        sum.deposit = deposit
        sum.withdrawal = withdrawal
        return sum
      }
    }
}])
.controller('AccountDetailCtrl', ['$scope', 'NgTableParams', '$routeParams', '$localStorage', 'sessionService', 'apiService', 'historyService', '$location', function ($scope, NgTableParams, $routeParams, $localStorage, sessionService, apiService, historyService, $location) {
  // Check session
  if (sessionService.isTokenExpire()) {  
    $location.path('/login')
  }

  $scope.logout = function () {
    sessionService.logout()
  }
  
  var storage = $localStorage
  $scope.accountInfo
  $scope.accountHistory
  $scope.accounts
  $scope.sum
  $scope.closingBalance
  $scope.accountInfo = {
    account_number: $routeParams.accountNum
  }
  
  $scope.accounts = storage.accounts
  
  $scope.accounts.forEach(function(item) {
    if (item.number == $routeParams.accountNum) {
      storage.accountInfo = item
      $scope.accountInfo = storage.accountInfo
    }
  })

  $scope.accountInfo = storage.accountInfo
  
  var no = 1  
  // Get accounts transaction history data
  historyService.accountHistory(function(data){
    $localStorage.accountHistory = data
    $scope.accountHistory = $localStorage.accountHistory

    $scope.sum = historyService.getBalance($scope.accountHistory)
    $scope.closingBalance = (Number($scope.accountInfo.opening_balance, 2) + Number($scope.sum.deposit, 2)) - (Number($scope.sum.payment, 2) + Number($scope.sum.withdrawal, 2))
  
    $scope.accountHistory.forEach(function(item){
      item.no = no
      item.amount = Number(item.amount, 2)
      no++
    })

    $scope.tableParams = new NgTableParams({}, { dataset: $scope.accountHistory });
  }, $routeParams.accountNum)
}]);
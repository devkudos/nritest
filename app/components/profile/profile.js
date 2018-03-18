'use strict';

angular.module('myApp.profile', ['ngRoute', 'ngResource'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'components/profile/profile.html',
    controller: 'ProfileCtrl'
  });
}])
.directive("profileDirective", function() {
  return {
    templateUrl: 'components/profile/profile.html',
    controller: 'ProfileCtrl'
  };
})
.controller('ProfileCtrl', ['$scope', 'sessionService', function ($scope, sessionService) {      
  $scope.profile
  sessionService.getProfile(function(result){
    $scope.profile = result
  })
}])
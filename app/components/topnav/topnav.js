'use strict';

angular.module('myApp.topnav', ['ngRoute', 'ngResource'])
.config(['$routeProvider', function($routeProvider, $resource) {
}])
.directive("topNavDirective", function() {
    return {
      templateUrl: 'components/topnav/topnav.html'
    };
})  
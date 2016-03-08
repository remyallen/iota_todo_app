var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/addtask', {
            templateUrl: '/views/templates/addTask.html',
            controller: 'HomeController'
        })
        .when('/viewTask', {
            templateUrl: '/views/templates/viewTask.html',
            controller: 'HomeController'
        })

        .otherwise({
            redirectTo: 'addtask'
        });

}]);
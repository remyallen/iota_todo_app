myApp.controller('HomeController', ['$scope', '$http', function($scope, $http) {
    console.log('Home Controller');
    getData();


    $scope.postData = function() {
        var post = {
            task: $scope.task
        };

        $http.post('/task', post).then(function(response) {
            $scope.post = response.data;
            console.log(response.data);
            $scope.task = '';
        });
    };

    function getData() {
        $http.get('/task').then(function(response) {
            $scope.taskHistory = response.data;

        });
    }


    $scope.delete = function(id) {
        console.log(id);
        $http.delete('/task/' + id).then(function(response) {
            getData();
            console.log(response.data);
        });
    };

}]);
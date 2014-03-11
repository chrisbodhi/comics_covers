var marvelCover = angular.module('marvelCover', []);

function mainController($scope, $http) {
  $scope.coverData = {};

  // show all of the covers
  $http.get('/api/covers')
       .success(function(data) {
          $scope.covers = data;
          console.log("working " + data);
       })
       .error(function(data) {
          console.log("Error: " + data);
       });

  // after submit the form data, send it to the node api
  $scope.createTodo = function() {
    $http.post('/api/todos', $scope.coverData)
         .success(function(data) {
           $scope.coverData = {};
           $scope.todos = data;
           console.log(data); 
         })
         .error(function(data) {
           console.log('Error: ' + data);
         });
  };

  // delete a todo after hitting the checkbox
  $scope.deleteTodo = function(id) {
    $http.delete('/api/todos' + id)
         .success(function(data) {
           $scope.todos = data;
           console.log(data);
         })
         .error(function(data) {
           console.log('Error: ' + data);
         });
  };
}
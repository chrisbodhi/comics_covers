"use strict";

var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
  $scope.formData = {};

  // show all of the todos
  $http.get('/api/todos')
       .success(function(data) {
          $scope.todos = data;
          console.log("working " + data);
       })
       .error(function(data) {
          console.log("Error: " + data);
       });

  // after submit the form data, send it to the node api
  $scope.createTodo = function() {
    $http.post('/api/todos', $scope.formData)
         .success(function(data) {
           $scope.formData = {};
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
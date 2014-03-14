"use strict";

// SETTING IT UP

var express   = require('express');
var app       = express();
var mongoose  = require('mongoose');
var api       = require('marvel-api');
// var process   = require('process');
// var keys      = require('./.env');

// CONFIGURATION

//== for the database

mongoose.connect('mongodb://localhost/api/todos');

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

//== config the Marvel API

var marvel = api.createClient({
//   publicKey: process.env.MARVEL_PUBLIC
// , privateKey: process.env.MARVEL_PRIVATE
  publicKey: '3699d5fb6e009e218438be4fa84b70d3'
, privateKey: '' 
});

// DEFINE MODEL

var Todo = mongoose.model('Todo', {
  text: String
});

// ROUTES

//== get all todos
app.get('/api/todos', function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
      res.send(err)
    }
    res.json(todos);
  });
});

//== make a todo, send back all todos after creation
app.post('/api/todos', function(req, res) {
  Todo.create({
    text  : req.body.text,
    done  : false
  }, function(err, todo) {
    if (err) {
      res.send(err);
    }
    Todo.find(function(err, todos) {
      if (err) {
        res.send(err)
      }
      res.json(todos);
    });
  });
});

//== delete a todo
app.delete('/api/todos/:todo_id', function (req, res) {
  Todo.remove({
    _id : req.params.todo_id
  }, function (err, todo) {
    if (err) {
      res.send(err);
    }
    Todo.find(function(err, todos) {
      if (err) {
        res.send(err);
      }
      res.json(todos);
    });
  });
});

// FRONTEND ROUTE

app.get('*', function(req, res) {
  res.sendfile('./public/index.html'); // load the single view file so Angular can handle the rest
});

// FINISH IT UP

app.listen(8080);
console.log("App hears you whisper on port 8080");


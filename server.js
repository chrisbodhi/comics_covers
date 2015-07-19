var express  = require('express'),
    app      = express();

// Load up the functions defined in the utils directory
var getComicsUri = require('./utils/creator_uri'),
    getComics    = require('./utils/comics_list'),
    getCovers    = require('./utils/covers');

// Array to be populated, then passed somehow [?] into the app
var list = [];

// Populates the list array with the image tags from getCovers
var showMe = function(arr) {
  'use strict';
  list = arr;
  console.log('list is ' + list.length);
  return list;
};

// // The promise chain that drives this bicycle wheel of nodeness
// // Start with a creator name, end with an array of image tags
// //   of their 20 most recent works
getComicsUri()
  .then(getComics)
  .then(getCovers)
  .then(showMe);

// To load static files from the public directory, i.e. our ng-app
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('index.html');
});

var server = app.listen(1337, function () {
  var host = server.address().address,
      port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);
});
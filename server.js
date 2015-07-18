var http     = require('http'),
    crypto   = require('crypto'),
    Q        = require('q'),
    dotenv   = require('dotenv'),
    request  = require('request');

// Prepare the md5 for making server-side call to API
// http://developer.marvel.com/documentation/authorization
//   -> "Authentication for Server-Side Applications"

var md5 = crypto.createHash('md5');

// Prepare the environmental variables, aka keys, stored in .env
dotenv.load();

// Placeholder test name - to be stored in a db or pulled from a form later
var first = 'Warren',
    last = 'Ellis';

// ts is a time stamp changed to a string for the URL
var ts = new Date().toTimeString();

// use the dotenv package to retrieve keys
var private_key = process.env.MARVEL_PRIVATE,
    public_key = process.env.MARVEL_PUBLIC;

// Hash created per dev docs to make the server-side call
var hash = md5.update(ts + private_key + public_key);

// hash.digest('hex') to turn hash into string of letters and numbers for public consumption
var hexed = hash.digest('hex');

// Start of the promises chain!
// Uses the Q.defer() helper method from the Q library
//   Creates a promise object, updates it with .resolve,
//   then passes return value using .promise at the end
//
// Uses 'request' to hit the API, returns the URI of the creator's comics
//   ex: http://gateway.marvel.com/v1/public/creators/:creatorID/comics
var getComicsUri = function(){
  "use strict";
  var deferred = Q.defer();
  
  request({
      method: 'GET',
      url: 'http://gateway.marvel.com/v1/public/creators',
      json: true,
      qs: {
        ts: ts,
        apikey: public_key,
        hash: hexed,
        firstName: first,
        lastName: last,
        limit: 20,
        offset: 0
      }
    }, function(err, res, body) {
      if (err){
        deferred.reject(new Error("Status code was " + res.statusCode));
      } else {
        deferred.resolve(body.data.results[0].comics.collectionURI);
      }
    });
    return deferred.promise;
};

// Takes the comicsCollection URI, gets a JSON object of the comics
// Returns only the first 20 entries currently
var getComicsFunction = function(collectionUri){
  "use strict";
  var deferred = Q.defer();
  
  request({
      method: 'GET',
      url: collectionUri,
      json: true,
      qs: {
        ts: ts,
        apikey: public_key,
        hash: hexed,
        limit: 20,
        offset: 0
      }
    }, function(err, res, body) {
      if (err){
        deferred.reject(new Error("Status code was " + res.statusCode));
      } else {
        deferred.resolve(body.data.results);
      }
    });
    return deferred.promise;
};

// Creates an array of image tags to be used on the frontend
// Image dimensions are specified by 'portrait_xlarge': 150 x 225
//   More dimension info: 
//     http://developer.marvel.com/documentation/images
// ex: [ '<img src="http://i.annihil.us/u/prod/marvel/i/mg/9/20/
//   533475ade25bc/portrait_xlarge.jpg" 
//   alt="Moon Knight (2014) #2" >', ..]
var getCovers = function(json) {
  "use strict";
  var imageTags = [];
  var deferred = Q.defer();

  for (var i = 0; i < json.length; i += 1 ) {
    imageTags.push('<img src="' + json[i].thumbnail.path + '/portrait_xlarge.' + json[i].thumbnail.extension + '" alt="' + json[i].title + '" >');
  }
  console.log(imageTags, "imageTags");
  deferred.resolve(imageTags);
  return deferred.promise;
};

// Array to be populated, then passed into the createServer
// function for display on screen
var list = [];

// Populates the list array with the image tags from getCovers
var showMe = function(arr) {
  "use strict";
  list = arr;
  return list;
};

// // The promise chain that drives this bicycle wheel of nodeness
// // Start with a creator name, end with an array of image tags
// //   of their 20 most recent works
// //
// // TODO: add function(reason) for fails for each dot-then
getComicsUri()
  .then(getComicsFunction)
  .then(getCovers)
  .then(showMe);

// Make server. Run functions to make API calls. Display images.
http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.end('Hello <b>World</b>\n' + list);
}).listen(1337);

console.log("listening on 1337");

// pass form data [name] to server
// if not in db, FIRE off to API to get id
//    then use id to get images from API
//    then store images in db
// else if in db, get id
//    then use id to get images from db

var http = require('http');
var crypto = require('crypto');
var Q = require('q');
var md5 = crypto.createHash('md5');

// Placeholder test name - to be stored in a db or pulled from a form later
var first = 'warren';
var last = 'ellis';

// ts is a time stamp changed to a string for the URL
// var ts = new Date().toTimeString();
var ts = new Date().toTimeString();
var private_key = '';
var public_key = '3699d5fb6e009e218438be4fa84b70d3';

// MD5 hash created per docs stated need for such a combination of information to make a call from the server; that is, node.js
var hash = md5.update(ts + private_key + public_key);

// hash.digest('hex') to turn hash into string of letters and numbers for public consumption
var hexed = hash.digest('hex');

// end of slug containing information for authenticating API request
var requisite = "ts=" + ts + "&apikey=" + public_key + "&hash=" + hexed;

// URL for making search based on creator name
var creatorURL = "http://gateway.marvel.com/v1/public/creators?firstName=" + first + "&lastName=" + last + "&" + requisite;

// Starts the promises chain!
// Uses http.get to hit the API, returns the URI of the creator's comics
var getComicsUri = function(uri){
  "use strict";
  var deferred = Q.defer();

  http.get(uri, function(res) {
    console.log("Status code: ", res.statusCode);
    var body = '';

    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function(chunk) {
      var responseJSON = JSON.parse(body);
      var comicsCollectionUri = responseJSON.data.results[0].comics.collectionURI;
      // console.log(comicsCollectionUri, "log from res.on in getComicsUri");
      deferred.resolve(comicsCollectionUri);
      // console.log(deferred.promise);
    });
  }).on('error', function(e) {
    console.log("Error: ", e);
  });
  return deferred.promise;
};

// Takes the comicsCollection URI, adds the requisite data for making a
// server-side call, gets a JSON object of the comics
var getComicsFunction = function(collectionUri){
  "use strict";
  var deferred = Q.defer();

  // console.log(collectionUri, "before make uri");
  collectionUri += "?" + requisite;
  // console.log(collectionUri, "after make uri");
  http.get(collectionUri, function(res) {
    console.log(res.statusCode);
    var body = '';

    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function(chunk) {
      var responseJSON = JSON.parse(body);
      // console.log(responseJSON);
      var comicsJSON = responseJSON.data.results[0];
      // console.log("getComicsFunction: ", comicsJSON);
      deferred.resolve(comicsJSON);
    });
  }).on('error', function(e) {
    console.log("Error: ", e);
  });
  return deferred.promise;
};

var getCovers = function(json) {
  "use strict";
  var imageTags = [];
  var deferred = Q.defer();

  console.log(json.thumbnail);
  // for (var i = 0; i < json.length; i += 1 ) {
  //   imageTags.push('<img src="' + json[i].thumbnail.path + '/portrait_xlarge.' + json[i].thumbnail.extension + '" alt="' + json[i].title + '" >');
  // }
  deferred.resolve(imageTags);
  return deferred.promise;
};

var showMe = function(arr) {
  "use strict";
  console.log(arr);
};

var testObject = function(blob) {
  console.log(blob);
};


// The promise chain that drives this bicycle wheel of nodeness
// TODO: add function(reason) for fails for each dot then
getComicsUri(creatorURL)
  // Return a JSON object of all comics [well, first 20]
  .then(getComicsFunction)
  .then(getCovers)
  .then(showMe)
  // .fail(function(error) {
  //   console.log(error);
  // })
  // .done();

// var get = function(url) {
//   "use strict";
//   // return a new promise
//   return new Promise(function(resolve, reject) {
//     http.get(url, function(res) {
//       console.log(res.statusCode);
//       var body = '';

//       res.on('data', function (chunk) {
//         body += chunk;
//       });

//       res.on('end', function(chunk) {
//         // console.log("at res.on(end) body:", body);
//         return body;
//       });
//     }).on('error', function(e) {
//       console.log("Error: ", e);
//     });
//   });
//   // console.log(body);
//   // return body;
// };

// run the function
// get(creatorURL).then(function(response) {
//   console.log("json!", response);
// });

// Make server. Run functions to make API calls. Display images.
http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  // console.log('before image is made: ', warrenEllis);
  // var template = "<img src='" + warrenEllis + "' />"
  // response.end('Hello <b>World</b>\n' + template);
  response.end('Hello <b>World</b>\n');
}).listen(8124);

// pass form data [name] to server
// if not in db, FIRE off to API to get id
//    then use id to get images from API
//    then store images in db
// else if in db, get id
//    then use id to get images from db
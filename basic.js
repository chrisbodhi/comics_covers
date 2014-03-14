"use strict";

var http = require('http');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');

// Placeholder test name - to be stored in a db or pulled from a form later
var first = 'warren';
var last = 'ellis';

// ts is a time stamp changed to a string for the URL
// var ts = new Date().toTimeString();
var ts = new Date().toTimeString();
var private_key = '9fb95b541971264dce4b4dc8a7c9bf8064b574a0';
var public_key = '3699d5fb6e009e218438be4fa84b70d3';

// MD5 hash created per docs stated need for such a combination of information to make a call from the server; that is, node.js
var hash = md5.update(ts + private_key + public_key);

// hash.digest('hex') to turn hash into string of letters and numbers for public consumption
var hexed = hash.digest('hex');

// end of slug containing information for authenticating API request
var requisite = "&ts=" + ts + "&apikey=" + public_key + "&hash=" + hexed;

// URL for making search based on creator name
var creatorURL = "http://gateway.marvel.com/v1/public/creators?firstName=" + first + "&lastName=" + last + requisite;

// Collects the URIs of the first 20 comics associated with the found name
var uriParser = function(json) {
  var uris = [];
  for (var i = 0; i < json.data.results[0].comics.items.length; i++){
    uris.push(json.data.results[0].comics.items[i].resourceURI);
  }
  return uris;
};

// Collects the URIs for each comic, puts the addresses to later hit into an array
var imageUris = function(arr) {
  var addys = [];
  for (var i = 0; i < arr.length; i++) {
    addys.push(arr[i] + '?' + requisite);
  }
  return addys;
};

var getCovers = function(allUris) {
  var imageTags = [];
  for (var i = 0; i < allUris.length; i++) {

    http.get(allUris[i], function(res) {
      var comicBody = ''; 

      res.on('data', function(comicChunk) {
        comicBody += comicChunk;
      });

      res.on('end', function() {
        var comicRes = JSON.parse(comicBody);
        var aTag = "<img src='" + comicRes.data.results[0].thumbnail.path + "/portrait_medium.jpg' >";
        imageTags.push(aTag);
      });
    });
    console.log(imageTags);
  }
  return imageTags;
};


http.get(creatorURL, function(res) {
  console.log("Response came in: " + res.statusCode);
  var body = '';

  res.on('data', function(chunk) {
    body += chunk;
  });

  res.on('end', function() {
    var responsible = JSON.parse(body);
    var uris = uriParser(responsible);
    
    // console.log(uris);
    // console.log(imageUris(uris));
    console.log(getCovers(imageUris(uris)));



    http.createServer(function (request, response) {
      response.writeHead(200, {'Content-Type': 'text/html'});
      // console.log('before image is made: ', warrenEllis);
      // var template = "<img src='" + warrenEllis + "' />"
      // response.end('Hello <b>World</b>\n' + template);
      response.end('Hello <b>World</b>\n');
    }).listen(8124);
  });
}).on('error', function(e) {
  console.log("D'oh! ", e);
});

// pass form data [name] to server
// if not in db, FIRE off to API to get id
//    then use id to get images from API
//    then store images in db
// else if in db, get id
//    then use id to get images from db
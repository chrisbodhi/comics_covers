var Q = require('q'),
    request  = require('request');

var helpers = require('./helpers');

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
        ts: helpers.ts,
        apikey: helpers.public_key,
        hash: helpers.hexed,
        firstName: 'Warren',
        lastName: 'Ellis',
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

module.exports = getComicsUri;
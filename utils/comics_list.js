var Q = require('q'),
    request  = require('request');

var helpers = require('./helpers');

// Takes the comicsCollection URI, gets a JSON object of the comics
// Returns only the first 20 entries currently
var getComics = function(collectionUri){
  'use strict';
  var deferred = Q.defer();
  
  request({
      method: 'GET',
      url: collectionUri,
      json: true,
      qs: {
        ts: helpers.ts,
        apikey: helpers.public_key,
        hash: helpers.hexed,
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

module.exports = getComics;
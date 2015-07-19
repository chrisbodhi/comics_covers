var Q = require('q');

// Creates an array of image tags to be used on the frontend
// Image dimensions are specified by 'portrait_xlarge': 150 x 225
//   More dimension info: 
//     http://developer.marvel.com/documentation/images
// ex: [ '<img src="http://i.annihil.us/u/prod/marvel/i/mg/9/20/
//   533475ade25bc/portrait_xlarge.jpg" 
//   alt="Moon Knight (2014) #2" >', ..]
var getCovers = function(json) {
  'use strict';
  var deferred = Q.defer();
  
  var imageTags = json.map(function(j){
    return '<img src="' + j.thumbnail.path + '/portrait_xlarge.' + j.thumbnail.extension + '" alt="' + j.title + '" >';
  });
  deferred.resolve(imageTags);
  return deferred.promise;
};

module.exports = getCovers;
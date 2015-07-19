var Q = require('q');

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
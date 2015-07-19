var crypto = require('crypto'),
    dotenv = require('dotenv');

// Prepare the environmental variables, aka keys, stored in .env
dotenv.load();
var private_key  = process.env.MARVEL_PRIVATE,
    public_key   = process.env.MARVEL_PUBLIC;

// ts is a time stamp changed to a string for the URL
var ts = new Date().toTimeString();

// Prepare the md5 for making server-side call to API
// http://developer.marvel.com/documentation/authorization
//   -> "Authentication for Server-Side Applications"
var md5 = crypto.createHash('md5'),
// Hash created per dev docs to make the server-side call
    hash = md5.update(ts + private_key + public_key),
// hash.digest('hex') to turn hash into string of letters and numbers for public consumption
    hexed = hash.digest('hex');

module.exports = {
  hexed: hexed,
  public_key: public_key,
  ts: ts
};
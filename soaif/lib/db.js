require('longjohn');

var util = require('util');
var fs = require('./filesystem');
var inflection = require('inflection');
var debug = require('./debug');
var tools = require('./tools');

var MongoClient = require('mongodb').MongoClient;
var format = util.format;

var CONN_STRING = 'mongodb://127.0.0.1:27017/nutshell';

exports.create = function(options, next) {

  var options = {
    table: options.table || 'data',
    data: options.data || { testProperty: 'testValue' }
  }

	MongoClient.connect(CONN_STRING, function(err, db) {
    if(err) throw err;
    var collection = db.collection(options.table);
    collection.insert(options.data, function(err, docs) {
      if(err) throw err;
      return next();
    });
  });
}

exports.read = function(options, next) {

  var options = {
    table: options.table || 'data',
    query: options.query || {}
  }

  MongoClient.connect(CONN_STRING, function(err, db) {
    if(err) throw err;
 
    db.collection(options.table).find(options.query).toArray(function(err, results) {
      if (err) {
        console.log('errrrrrrr while reading from db:');
        debug.sho(options.query);
        throw err;
      }
      
      db.close();

      console.log(results.length);

      return next(results);
    });
  });
}

exports.collection = function(name, next) {
  MongoClient.connect(CONN_STRING, function(err, db) {
    if (err) throw err;
    return next(db.collection(name));
  });
}

exports.open = function(next) {
  MongoClient.connect(CONN_STRING, function(err, db) {
    if (err) next(err, null);
    return next(null, db);
  });
}
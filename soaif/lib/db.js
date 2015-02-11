require('longjohn');

var util = require('util');
var fs = require('./filesystem');
var inflection = require('inflection');
var debug = require('./debug');
var tools = require('./tools');

var MongoClient = require('mongodb').MongoClient;
var format = util.format;

var CONN_STRING = 'mongodb://127.0.0.1:27017/test';

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
  })
}

exports.read = function(options, next) {

  var options = {
    table: options.table || 'data',
    query: options.query || {}
  }

  MongoClient.connect(CONN_STRING, function(err, db) {
    if(err) throw err;
 
    var collection = db.collection(options.table);

    collection.find(options.query).toArray(function(err, results) {
      if (err) {
        console.log('errrrrrrr while reading from db:');
        debug.sho(options.query);
        throw err;
      }
      
      db.close();

      return next(results);
    });
  })
}
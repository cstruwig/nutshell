require('longjohn');

var util = require('util');
var fs = require('./filesystem');
var inflection = require('inflection');
var debug = require('./debug');
var tools = require('./tools');
//var Firebase = require('firebase');
//var nsDB = new Firebase('https://nutshell.firebaseio.com/');

function x(options) {

	throw new Error('')
}

exports.create = function(options, next) {

	var options = {
		table: options.table || '',
		data: options.data || {}
	}

	try {

	}
	catch (err) {

	}

	return next();
}

exports.read = function(options, next) {
	return next();
}

exports.update = function(options, next) {
	return next();
}

exports.delete = function(options, next) {
	return next();
}

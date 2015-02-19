require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var db = ns.db;
var util = require('util');

module.exports = {
	getTimer: function() {

	},
	getCounterNames: function(next) {
		ns.db.open(function(err, connection) {
			if (err) return next(null);	//FIX!
			connection.collection('counter').distinct('key', function(err, results) {
				var counterNames = results.map(function(item) { 
					return item.replace('counter.nutshell.', '');
				});
				connection.close();
				return next(counterNames);
			});
		});
	},
	getCounter: function(name, next) {
		ns.db.open(function(err, connection) {
			if (err) return next(null);	//FIX!
			connection.collection('counter').find({ key: { $regex: name.toLowerCase() } }, { key: 1, total: 1 }).toArray(function(err, results) {
				
				var counters = results.map(function(result) {
					var counter = {};
					counter[result.key.replace('counter.nutshell.', '').toLowerCase()] = result.total;
					return counter;
				});
				console.log(counters, 'cowntirz');
				connection.close();
				return next(counters);
			});
		});
	},
	getCounters: function(names, next) {
		//FIX!
	},
	addCounter: function(name) {
		//FIX! cant do this!!! as the stack is altering the counterName... for now copy the logic from addCounters
		// if (name.isArray()) {
		// 	this.addCounters(name);	
		// } else {
		// 	this.addCounters(name.makeArray());
		// }
		var functionName = ($nsf1 === '<anonymous>()') ? $nsf2 : $nsf1;
		
		var counterName = 'counter.nutshell.' + $nsm.replace(/.js/gi, '') + '.' + functionName.replace('()', '') + '.' + name;

		ns.db.open(function(err, connection) {
			if (err) return;	//FIX!
			connection.collection('counter').findAndModify(
				{ key: counterName.toLowerCase() }, 
				[['_id','asc']],  // sort order
  				{ $inc: { total: 1 } },
  				{ upsert: true },
  				function() {
  					connection.close();
					console.log('dan ek tjoen');
				}
			);
		});

// 		db.collection('counter', function(collection) {
// 			collection.findAndModify(
// 				{ key: counterName.toLowerCase() },
//   				[['_id','asc']],  // sort order
//   				{ $inc: { total: 1 } },
//   				{ upsert: true },
//   				function() {
// //					console.log('sssssssss', counterName);
// 				}
// 			);
// 		});		
	},
	addCounters: function(names) {
		if (!names.isArray()) {
			return;
		}
		for (var i=0; i<names.length; i++) {
			console.log(i + ':' + names[i]);
			//to include latest count use the "new" option - http://mongodb.github.io/node-mongodb-native/markdown-docs/insert.html#find-and-modify
			//FIX! the callback to findandmodify only fires after the counterName has been updated! will always yield last element name :(
			var counterName = 'counter.nutshell.' + $nsm.replace(/.js/gi, '') + '.' + $nsf1.replace('()', '') + '.' + names[i];
			db.collection('counter', function(collection) {
				collection.findAndModify(
					{ key: counterName.toLowerCase() },
	  				[['_id','asc']],  // sort order
	  				{ $inc: { total: 1 } },
	  				{ upsert: true },
	  				function() {
						console.log('sssssssss', counterName);
					}
				);
			});
		}		
	}
}
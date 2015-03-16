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
	getCounters: function(options, next) {

		var options = {
			name: options.name,
			grouping: options.grouping || 'totals'
		}

		ns.db.open(function(err, connection) {
			if (err) return next(null);	//FIX!
			connection.collection('counter').find({ key: { $regex: options.name.toLowerCase() } }, { key: 1, total: 1 }).toArray(function(err, results) {

				//FIX! if (err)
				console.log(results);
				var counters = [];

				switch (options.grouping) {
					case 'none':
						counters = results.map(function(result) {
							var counter = {};
							
							counter[result.key.replace('counter.nutshell.', '').toLowerCase()] = result.total;
							return counter;
						});
						break;
					case 'totals':
					default:
						counters = results.map(function(result) {
							var counter = {};
							counter[result.key.replace('counter.nutshell.', '').toLowerCase()] = result.total;
							return counter;
						});
						break;
				}
				
				connection.close();
				return next(null, counters);
			});
		});
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
  				function() {sj
  					connection.close();
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
	addRequest: function(path, next) {
		//FIX! cant do this!!! as the stack is altering the counterName... for now copy the logic from addCounters
		// if (name.isArray()) {
		// 	this.addCounters(name);	
		// } else {
		// 	this.addCounters(name.makeArray());
		// }

		var request = {
			path : path,
			date : new Date()
		}

		ns.db.open(function(err, connection) {
			if (err) return;	//FIX!
			connection.collection('request').insert(request, function(err, inserted) {
				connection.close();
				if (err) return next(null);
				return next(null, inserted);
			});
		});
	},
	// addCounters: function(names) {
	// 	console.log('not this one!!!');
	// 	if (!names.isArray()) {
	// 		return;
	// 	}
	// 	for (var i=0; i<names.length; i++) {
	// 		console.log(i + ':' + names[i]);
	// 		//to include latest count use the "new" option - http://mongodb.github.io/node-mongodb-native/markdown-docs/insert.html#find-and-modify
	// 		//FIX! the callback to findandmodify only fires after the counterName has been updated! will always yield last element name :(
	// 		var counterName = 'counter.nutshell.' + $nsm.replace(/.js/gi, '') + '.' + $nsf1.replace('()', '') + '.' + names[i];
	// 		db.collection('counter', function(collection) {
	// 			collection.findAndModify(
	// 				{ key: counterName.toLowerCase() },
	//   				[['_id','asc']],  // sort order
	//   				{ $inc: { total: 1 } },
	//   				{ upsert: true },
	//   				function() {
	// 					console.log('sssssssss', counterName);
	// 				}
	// 			);
	// 		});
	// 	}		
	// }
}
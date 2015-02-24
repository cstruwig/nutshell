require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var db = ns.db;
var metrics = ns.metrics;
var util = require('util');

module.exports = {
	getCounterNames: function(nsReq, next) {
		
		//******************* setup filters....
		var name = nsReq.getParameter('name', {
			typeName: 'string',
			description: 'partial name of counters to retrieve'
		}).toLowerCase();

		//FIX! validate inputs

		var result = tools.collection('names');

		metrics.getCounterNames(function(names) {
			if (name !== '') {
				names.forEach(function(counterName) {
					if (counterName.toLowerCase().includes(name.toLowerCase())) {
						result.add(counterName);
					}
				});
			} else {
				result.add(names);
			}

			nsReq.response.data = result.data();
			nsReq.response.status = 'valid';

			next(null, nsReq);
		});
	},
	getMetrics: function(nsReq, next) {
		
		//******************* setup filters....
		var name = nsReq.getParameter('name', {
			typeName: 'string',
			description: 'counter or timer name to retrieve',
			mandatory: true
		}).toLowerCase();

		var result = tools.collection('counters');

		metrics.getCounter(name, function(counters) {

			counters.forEach(function(counter) {
				var count = {}
				for(var key in counter) {
					count.name = key;
					count.total = counter[key];
				}
				
				result.add(count);	
			});

			nsReq.response.data = result.data();
			nsReq.response.status = 'valid';

			next(null, nsReq);
		});		
	}
	//FIX! consider implementing addCount()...
	// addCount: function(name, next) {
	// 	var counterName = 'counter.nutshell.' +  + '.';
		
	// 	//******************* setup filters....
	// 	var name = nsReq.getParameter('name', {
	// 		typeName: 'string',
	// 		description: 'counter name to increment',
	// 		defaultValue: 'unknown'
	// 	}).toLowerCase();

	// 	//var result = tools.collection('counters');

	// 	db.collection('counter').update(
	// 		{ key: counterName + name },
	// 		{ $inc: { value: 1 } }
	// 	);

	// 	//nsReq.response.data = result.data();
	// 	nsReq.response.status = 'valid';

	// 	next(null, nsReq);
	// }
}
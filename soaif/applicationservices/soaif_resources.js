require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var fs = require('fs');
var util = require('util');

module.exports = {
	//getResources: tools.getResources,
	getResources: function(nsReq, next) {			
		
		var result = tools.collection('resources');

		result.add({ name: 'services' });
		//result.add({ name: 'kwagga' });

		// result.each(function(i, item) {
		// 	console.log(i + '=' + item.name);
		// });
		
		nsReq.response.data = result.data();
		
		next(nsReq);
	}
}
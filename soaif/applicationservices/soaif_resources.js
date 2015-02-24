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
		nsReq.response.data = result.data();
		
		next(null, nsReq);
	}
}
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
		
		result.add({ name: 'services', url: 'http://localhost:8080/nutshell/soaif/services' });
		result.add({ name: 'metrics', url: 'http://localhost:8080/nutshell/soaif/metrics' });
		result.add({ name: 'roles', url: 'http://localhost:8080/nutshell/soaif/roles' });
		result.add({ name: 'resources', url: 'http://localhost:8080/nutshell/soaif/resources' });

		nsReq.response.data = result.data();
		
		next(null, nsReq);
	}
}
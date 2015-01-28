var debug = require('./debug');
var inflection = require('inflection');

exports.parse = function(nsReq, next) {
	
	try {
		var crud = 'get';
		var output = 'json';
		var resource = (nsReq.req.params.resource || '').toLowerCase();
		debug.lo('requestedResource', resource);

		//check for output
		var pos = resource.indexOf('.');
		if (pos > -1) {
			output = resource.substring(pos+1) || '';
			resource = resource.substring(0, pos);

			switch (output.toLowerCase()) {
				case 'xml':
					output = 'xml';
					break;	
				case 'view':
					output = 'view';
					break;
				case 'json':
				default:
					output = 'json';
					break;
			}
		}

		switch (nsReq.req.method.toLowerCase()) {
			case 'put':
				break;
			case 'post':
				break;				
			case 'get':
			default:
				crud = 'get';
				break;
		}


		nsReq.resource.name = inflection.pluralize(resource);
		nsReq.resource.functionName = crud + inflection.titleize(nsReq.resource.name);
		nsReq.resource.output = output;
		debug.lo('output', output);
		debug.lo('calculatedResource', nsReq.resource.name);				
	}
	catch (err) {
		nsReq.status = 'invalid';
		debug.log('*** error while parsing resource [' + err + ']');
		return next(err, null);
	}
	
	next(null, nsReq);
}
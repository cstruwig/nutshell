var debug = require('./debug');

function getDistinctValues(value) {
	var result = value;
	if (typeof value === 'string') {
		var tmp = value.split(',');
		if (tmp.length > 1) {
			result = tmp.distinctValues().join();
		}
	} else {
		console.log('FIX! parsePArameters() - FYI: THIS IS HAPPENING CAUSE A DUPLICATE QUEYRYSTRING HAS BEEN SPECIFIED... ALSO REMEMBER TO FIX MIXED CASE QS ITEMS eg. ?x=1&X=2');
	}
	return result;
}

function getFirstValue(value) {
	var result = value;
	var tmp = value.split(',');
	if (tmp.length > 1) {
		result = tmp[0];
	}
	return result;
}

exports.parse = function(nsReq, next) {

	try
	{
		var params = nsReq.req.query;
		
		for (key in params) {
			if (params[key].hasValue()) {
				switch (key.toLowerCase()) {
					case 'pagesize' :
					case 'size' :															
						nsReq.options.pageSize = getFirstValue(params[key]);
						debug.lo('pageSize', nsReq.options.pageSize);
						break;
					case 'idx' :						
					case 'index' :
						nsReq.options.index = getFirstValue(params[key]);
						debug.lo('index', nsReq.options.index);
						break;
					case 'view' :
						nsReq.options.view = getFirstValue(params[key]);
						debug.lo('view', nsReq.options.view);
						break;
					case 'save' :
						nsReq.options.save = getFirstValue(params[key]);
						debug.lo('save', nsReq.options.save);
						break;
					case 'debug' :
						nsReq.options.debug = getFirstValue(params[key]);
						debug.lo('debug', nsReq.options.debug);
						break;		
					case 'educateme' :
						nsReq.options.educateme = true;
						break;						
					default:
						//other params
						nsReq.parameters[key.toLowerCase()] = getDistinctValues(params[key]);
						debug.lo(key.toLowerCase(), nsReq.parameters[key.toLowerCase()]);
						break;
				}
			}
		}
	}
	catch (err) {
		nsReq.status = 'invalid';
		debug.log('*** error while parsing service [' + err + ']');
		next(err, null);
	}

	next(null, nsReq);
}
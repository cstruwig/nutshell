require('longjohn');

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
			key = key.toLowerCase();
			if (params[key].hasValue()) {
				switch (key) {
					case 'model' :
						nsReq.options.model = getFirstValue(params[key]);
						debug.lo('model', nsReq.options.model);
						break;
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
						nsReq.filter[key] = getDistinctValues(params[key]);
						//console.log('nsReq.filter["' + key + '"] = "' + nsReq.filter[key] + '"');
						debug.lo(key, nsReq.filter[key]);
						break;
				}
			}
		}
	}
	catch (err) {
		nsReq.status = 'invalid';
		debug.log('*** error while parsing parameters [' + err + ']');
		next(err, null);
	}

	next(null, nsReq);
}
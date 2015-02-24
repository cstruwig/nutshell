require('longjohn');

var Q = require('q');
var inflection = require('inflection');
var fs = require('fs');

exports.guid = function(val) {
	var guid = require('guid').create();
	if (!guid) {
		return new Guid(val);
	}
	return guid;
};

exports.collection = function(name) {

	var plural = inflection.pluralize(name);
	var singular = inflection.singularize(name);
	var index = -1;
	
	var result = {
		add: function(obj) {
			//FIX! support adding multiples...
			if (obj.isArray()) {
				obj.forEach(function(item) {
					result[plural][singular].push(item);
				});
			} else {
				this[plural][singular].push(obj);			
			}
		},
		get length() {
			return this[plural][singular].length;
		},
		each: function (callback, args) {
		    var value;
		    var i = 0;
		    var obj = this[plural][singular];
		    var length = obj.length;
		    var isArray = obj.isArray(); //isArraylike(obj);

		    if (args) {
		        if (isArray) {
		            for (; i < length; i++) {
		                value = callback.apply(obj[i], args);

		                if (value === false) {
		                    break;
		                }
		            }
		        } else {
		            for (i in obj) {
		                value = callback.apply(obj[i], args);

		                if (value === false) {
		                    break;
		                }
		            }
		        }

		        // A special, fast, case for the most common use of each
		    } else {
		        if (isArray) {
		            for (; i < length; i++) {
		                value = callback.call(obj[i], i, obj[i]);

		                if (value === false) {
		                    break;
		                }
		            }
		        } else {
		            for (i in obj) {
		                value = callback.call(obj[i], i, obj[i]);

		                if (value === false) {
		                    break;
		                }
		            }
		        }
		    }

		    return obj;
		},
		data: function() {
			var data = {};
			data[plural] = result[plural];
			return data;
		}
	};
	
	result[plural] = {};
	result[plural][singular] = [];
	
	return result;
}

exports.getResources = function(nsReq, next) {

	var result = exports.collection('resources');

	var deferred = Q.defer();

	try {

		for (var name in nsReq.service.module) {

			var nameFilter = nsReq.getParameter('name', {
				inputType: 'string',
				mandatory: false,
				description: 'partial name to filter resources'
			});

			obj = nsReq.service.module[name];
			if (!!(obj && obj.constructor && obj.call && obj.apply) ) { //} && name !== 'getResources') {
				//its a function, now lets check for the CRUDs

				if (name.startsWith('get') || name.startsWith('add') || name.startsWith('update') || name.startsWith('delete')) {
					var resource = name.replace('get', '').replace('add', '').replace('udpate', '').replace('delete', '').toLowerCase();

					if (nameFilter && resource.includes(nameFilter)) {
						result.add({ name: resource });	
					} else if (!nameFilter) {
						result.add({ name: resource });	
					}
				}
			} else {
				// if (name === 'getResources') {
				// 	var resource = name.replace('get', '').replace('add', '').replace('udpate', '').replace('delete', '').toLowerCase();
				// 	result.add({ name: resource });				
				// }
			}
		}

		nsReq.response.data = result.data();

		deferred.resolve(nsReq);
	}
	catch (err) {
		deferred.reject(err);
	}

	return deferred.promise.nodeify(next);
}

exports.getFileList = function(path, next) {

	var result = exports.collection('files');
	var files = fs.readdirSync(path);

	files.makeArray().forEach(function(item) {
		if (!item.startsWith('.'))
			result.add({ name: item });
	});

	next(null, result);
}

exports.getURL = function(req, options) {
	
	var result = '';
	
	var options = {
		excludeHost: options.excludeHost || false,
		excludePath: options.excludePath || false
	};

	if (!options.excludeHost) {
		result = (req.isSecure()) ? 'https' : 'http' + '://' + req.headers.host;
	}

	if (!options.excludePath) {
		result += req.url;	
	}
	

	return result;
}
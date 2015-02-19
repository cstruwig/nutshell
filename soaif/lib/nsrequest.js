require('longjohn');

//nsRequest.js
var debug = require('./debug');

function getDefaultValueForType(typeName) {
	var defaultValue;

	switch (typeName) {
		case 'bool': 
			defaultValue = false;
			break;
		case 'integer': 
			defaultValue = -1;
			break;
		case 'date': 
			defaultValue = new Date(1970, 1, 1);
			break;
		case 'string':
		default:
			defaultValue = '';
			break;
	}

	return defaultValue;
}

exports.parse = function(nsReq, next) {

	nsReq.ref = nsReq.req.id();

	//check service exists
	require('./resourceparser').parse(nsReq, function(err, nsReq) {
		if (err) {
			debug.log('failed to parse resource [' + err + ']');
			next(err, null);
		} else {
			require('./serviceparser').parse(nsReq, function(err, nsReq) {
				if (err) {
					debug.log('failed to parse service [' + err + ']');
					next(err, null);
				} else {
					require('./paramparser').parse(nsReq, function(err, nsReq) {
						if (err) {
							debug.log('failed to parse parameters [' + err + ']');
							next(err, null);
						} else {
							require('./authorize').authorize(nsReq, function(err, nsReq) {
								if (err) {
									debug.log('failed to authorize [' + err + ']');
									next(err, null);
								} else {
									nsReq.status = 'valid';			//only then...
									next(null, {});				
								}
							});
						}
					});
				}
			})
		}
	});
}

exports.init = function(req, res) {

	return {
		req: req,
		res: res,
		ref: null,
		host: 'n/a',
		date: new Date(),
		status: null,
		authorized: false,
		_messages: [],
		get messages() {
			return _messages;
		},
		consumer: {
			consumerId: null,
			token: null
		},
		options: {
			pageSize: 20,
			index: 0,
			view: 'default',
			save: false,
			debug: false,
			educateme: false,
			model: ''
		},
		service: {
			name: null,
			serviceType: null,
			modulePath: null,
			module: {}
		},
		filter: {},
		education: {},
		resource: {
			name: null,
			funcionName: '',
			output: 'json'
		},
		nsReqGod: false,
		request: {
			url: 'http://{{host:port}}/nutshell/',
			path: '{{service}}/{{resource}}/{{singularResource}}'			//FIX! move this one level up! why request!!!?
		},
		response: {
			ref: null,
			status: null, 
			data: {}
		},
		addMessage: function(message) {
			this._messages.push[message];
		},
		invalidFilter: function() {
			//FIX!
			// for (var key in this.filter) {
			// 	if (this.filter[key].mandatory) {

			// 	}
			// }

			return false;
		},
		getParameter: function(parameterName, attributes) {
			var attributes = {
				name: parameterName.toLowerCase(),
				inputType: attributes.typeName || 'string',
				mandatory: attributes.mandatory || false,
				options: attributes.options || [],
				description: attributes.description || 'input value',
				defaultValue: attributes.defaultValue || getDefaultValueForType(this.inputType), //typeName),
				value: req.params[parameterName] || ''
				//maxValue: attributes.max || 5000
			}
			
			if (attributes.options.length > 0) {
				attributes.inputType = 'list';

				// //FIX! we need support for multiple input params!!!!!
				// //for lists verify that all specified options are valid
				// if (attributes.value.includes(',')) {
				// 	var validateOptions = [];
				// 	attributes.value.split(',').forEach(function(specifiedOption) {
				// 		if (attributes.options.contains(specifiedOption)) {
				// 			validateOptions.push(specifiedOption);
				// 		}
				// 	});

				// 	var validateOptions2 = attributes.value.split(',').map(function(specifiedOption) {
				// 		if (attributes.options.contains(specifiedOption)) {
				// 			return specifiedOption;
				// 		}
				// 	}).distinctValues();
				// }

				// console.log('valid options are ' + validateOptions.join(' and '));
				// console.log('2valid options are ' + validateOptions2.join('.'));
			}

			//base validation
			var invalidListOption = ( (attributes.options.length > 0) && (!attributes.options.contains(attributes.value)) );
			var emptyParamOption = (typeof attributes.value === 'undefined' || attributes.value === '');

			if (invalidListOption || emptyParamOption) {
				console.log('defaulting value... [parameter=' + parameterName + ', invalidListOption=' + invalidListOption + ', emptyParamOption=' + emptyParamOption + ']');
				attributes.value = attributes.defaultValue;
			}

			this.filter[attributes.name] = attributes.value;
			this.education[attributes.name] = attributes;

			//FIX! validate and set attributes.value according to type, maxValue, etc...
			var result = attributes.value;

/*

			//FIX!
			if (attributes.mandatory && ) {				
			}

			//if mandatory and no value...
			//FIX! what then?
*/			
			return result;
		}
	}
};
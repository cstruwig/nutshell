require('longjohn');

//nsRequest.js
var debug = require('./debug');

function getDefaultValueForType(typeName) {
	var defaultValue;

	switch (typeName) {
		case 'bool': 
			defaultValue = false;
			break;
		case 'number': 
			defaultValue = -1;
			break;
		case 'list': 
			defaultValue = '!error!';
			break;
		case 'date': 
			defaultValue = Date.now(); //new Date(1970, 1, 1);
			break;
		case 'string':
		default:
			defaultValue = '';
			break;
	}

	return defaultValue;
}

exports.parse = function(nsReq, next) {

	//check service exists
	require('./resourceparser').parse(nsReq, function(err, nsReq) {
		if (err) {
			debug.log(nsReq.ref + ' failed to parse resource [' + err + ']');
			return next(err, null);
		}

		debug.log(nsReq.ref + ' parsed resource OK');
		require('./serviceparser').parse(nsReq, function(err, nsReq) {
			if (err) {
				debug.log(nsReq.ref + ' failed to parse service [' + err + ']');
				return next(err, null);
			}

			debug.log(nsReq.ref + ' parsed service OK');
			require('./paramparser').parse(nsReq, function(err, nsReq) {
				if (err) {
					debug.log(nsReq.ref + ' failed to parse parameters [' + err + ']');
					return next(err, null);
				}

				debug.log(nsReq.ref + ' parsed parameters OK');
				require('./authorize').authorize(nsReq, function(err, nsReq) {
					if (err) {
						debug.log(nsReq.ref + ' failed to authorize [' + err + ']');
						return next(err, null);
					}

					debug.log(nsReq.ref + ' the request is authorized and 100% valid');
					nsReq.status = 'valid';			//only then...
					next(null, {});				
				});

			});
		});
	});
}

exports.init = function(req) {
	return {
		req: req,
		ref: req.id(),
		host: 'n/a',
		date: Date.now(),
		status: null,
		authorized: false,
		_messages: [],
		get messages() {
			return _messages;
		},
		// get data() {
		// 	return response.data;
		// },
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
		validInputs: true,
		filter: {},
		education: {},
		resource: {
			name: null,
			funcionName: '',
			output: 'json'				//FIX! move output to options
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
		validFilter: function() {
			return this.validInputs;
		},
		getParameter: function(parameterName, attributes) {
			var attributes = {
				name: parameterName.toLowerCase(),
				inputType: attributes.typeName || 'string',
				mandatory: attributes.mandatory || false,
				options: attributes.options || [],
				description: attributes.description || 'input value',
				defaultValue: attributes.defaultValue || getDefaultValueForType(this.inputType), //typeName),
				value: req.params[parameterName] || attributes.value || '',
				//maxValue: attributes.max || 5000
			}

			//console.log('attributes.value [' + parameterName + ']', attributes.value);
			if (attributes.options && attributes.options.length > 0) {
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
				//console.log('defaulting value... [parameter=' + parameterName + ', invalidListOption=' + invalidListOption + ', emptyParamOption=' + emptyParamOption + ']');
				attributes.value = attributes.defaultValue;
				if (attributes.mandatory) {
					this.validInputs = false;		//FIX! keep keywords or namespace them...
				}
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
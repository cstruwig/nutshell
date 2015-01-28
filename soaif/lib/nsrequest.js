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
			educateme: false
		},
		service: {
			name: null,
			serviceType: null,
			modulePath: null,
			module: {}
		},
		parameters: {},
		education: {},
		resource: {
			name: null,
			funcionName: '',
			output: 'json'
		},
		response: {
			ref: null,
			status: null, 
			data: {}
		},
		addMessage: function(message) {
			this._messages.push[message];
		},
		optionsForParameter: function(parameterName) {
			return this.education[parameterName].options;
		},
		getParameter: function(parameterName, attributes) {
			var attributes = {
				name: parameterName.toLowerCase(),
				typeName: attributes.typeName || 'string',
				mandatory: attributes.mandatory || false,
				options: attributes.options || [],
				description: attributes.description || 'input value',
				defaultValue: attributes.defaultValue || getDefaultValueForType(this.typeName),
				value: req.params[parameterName] || ''
			}

			if 	( 
					(attributes.options.length > 0 && !attributes.options.contains(attributes.value)) 
					||
					(typeof attributes.value === 'undefined' || attributes.value === '') 
				) {
				
				//FIX! if mandatory don't serve response!!!
				console.log('defaulting parameter [param=' + attributes.name + ', supplied=' + attributes.value + ', default=' + attributes.defaultValue + ']');
				attributes.value = attributes.defaultValue;
			}

			this.parameters[parameterName.toLowerCase()] = attributes.value;
			this.education[parameterName] = attributes;

			var result = this.parameters[parameterName];
			
			//FIX!
/*			if (attributes.mandatory && ) {
				
			}
*/

			//if mandatory and no value...
			
			return result;
		}
	}
};

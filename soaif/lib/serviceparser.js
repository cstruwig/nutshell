require('longjohn');

var debug = require('./debug');
var inflection = require('inflection');
var fs = require('./filesystem');
var util = require('util');
var path = require('path');
var tools = require('./tools');
var db = require('./db');

function nutshellIt(module) {
	module.getResources = tools.getResources
}

exports.parse = function(nsReq, next) {
	
 	try {
		var service = nsReq.service || '';
		var serviceFound = false;
		var serviceName = (nsReq.req.params.service || '').toLowerCase();
		var resource = nsReq.resource.name;

		debug.lo('serviceName', serviceName);

		switch (serviceName) {
			//FIX! expose application services too? thinking HARD!!!
			//case 'application':
			//	modulePath = __dirname + '/../../application/' + req.params.enterprise + '.js';
			//	serviceType = 'application';
			//	break;
			case 'soaif': 	//are these not application services? eg. 'application'
				//FIX!
				debug.lo('service type', 'SOAIF');
				service.modulePath = process.cwd() + '/soaif/applicationservices/soaif_' + inflection.pluralize(resource) + '.js';
				service.serviceType = 'soaif';
				serviceFound = fs.fileExists(service.modulePath);
				if (!serviceFound) {
					throw new Error('soaif service not found or invalid');
				} else {
					debug.lo('service physicalName', 'soaif_' + inflection.pluralize(resource) + '.js');
				}
				break;
			default:
				service.modulePath = process.cwd() + '/soaif/enterpriseservices/' + serviceName + '.js';
				//service.modulePath = __dirname + '/../enterpriseservices/' + serviceName + '.js'; //__dirname + '/../../enterprise/' + serviceName + '.js';
				if (fs.fileExists(service.modulePath)) {
					debug.lo('service type', 'ENTERPRISE');
					service.serviceType = 'enterprise';
					serviceFound = true;
				} else {
					debug.lo('service type', 'COMPOUND (or non existing...)');
					service.modulePath = process.cwd() + '/soaif/compoundservices/' + serviceName + '.js';
					//service.modulePath = __dirname + '/../../compound/' + serviceName + '.js';
					service.serviceType = 'compound';

					//remove the 'get' and otjer CRUD prefixes for custom models
					if (nsReq.resource.functionName != 'getResources') {
						debug.log(nsReq.ref + ' compound service intricacies - before:' + nsReq.resource.functionName);
						nsReq.resource.functionName = nsReq.resource.name;
						debug.log(nsReq.ref + ' compound service intricacies - after:' + nsReq.resource.functionName);
					}
				}
				break;
		}

		if (serviceFound || fs.fileExists(service.modulePath)) {	//prevent extra fileExists() call

			service.name = serviceName;

			nsReq.request.url = tools.getURL(nsReq.req, { excludePath: true }); // + '/nutshell/';
			nsReq.request.path = nsReq.request.path.replace('{{service}}', serviceName);
			try
			{
				// if (nsReq.output === 'html') {
				// } else {
				// }

				db.open(function(err, connection) {
					if (err) {
						return next(err, null);	//FIX! set error n nsReq
					}
					connection.collection('defaultView').findOne({ path: nsReq.request.path }, function(err, results) {
						if (results && results.view.name !== '') {
							debug.lo('found DB view', results.view.name);
							nsReq.options.view = results.view.name;
						}

						connection.close();
						service.module = require(service.modulePath);

						//"inherit" service functions...
						if (service.serviceType !== 'soaif') { //for soaif_resources
							nutshellIt(service.module);
						}

						return next(null, nsReq);
					});
				});
			}
			catch (err) {		
				debug.lo('invalid service or resource ' + err);
				return next(err);
			}

			//FIX! we can't set it valid here already... //nsReq.status = 'valid'; but probably shouldn't
		} else {
			debug.lo('service fail', 'doesn\'t exist')
			return next(new Error('invalid or missing service name specified'), null);
			//FIX! remove
			//delete result.modulePath;
		}
	}
	catch (err) {
		nsReq.status = 'invalid';
		debug.log(nsReq.ref + ' error while parsing service [' + err + ']');
		return next(err, nsReq);
 	}

	//next(null, nsReq);
}
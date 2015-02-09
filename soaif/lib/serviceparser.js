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
				console.log('=====================================****************');
				service.modulePath = process.cwd() + '/soaif/applicationservices/soaif_' + inflection.pluralize(resource) + '.js';
				service.serviceType = 'soaif';
				serviceFound = fs.fileExists(service.modulePath);
				if (!serviceFound) {
					throw new Error('invalid soaif resource');
				} else {
					console.log('valid soaif resource [name=soaif_' + inflection.pluralize(resource) + '.js]');
				}
				break;
			default:
			console.log('----------------------------****************');
				service.modulePath = process.cwd() + '/soaif/enterpriseservices/' + serviceName + '.js';
				//service.modulePath = __dirname + '/../enterpriseservices/' + serviceName + '.js'; //__dirname + '/../../enterprise/' + serviceName + '.js';
				if (fs.fileExists(service.modulePath)) {
					service.serviceType = 'enterprise';
					serviceFound = true;
				} else {
					service.modulePath = process.cwd() + '/soaif/compoundservices/' + serviceName + '.js';
					//service.modulePath = __dirname + '/../../compound/' + serviceName + '.js';
					service.serviceType = 'compound';
				}
				break;
		}

		if (serviceFound || fs.fileExists(service.modulePath)) {	//prevent extra fileExists() call

			service.name = serviceName;

			nsReq.request.url = tools.getURL(nsReq.req, { excludePath: true });
			nsReq.request.path = nsReq.request.path.replace('{{service}}', serviceName);

			try
			{
				var readStmt = { 
					table: 'defaultView', 
					path: nsReq.path,
					dirty: true };		//FIX! maybe change db property to "cached" instead of "dirty"??

				//db.read(readStmt, function(err, data) {

					// if (err)
					// 	return (next(new Error('db read failure')));

					//nsReq.fi data.defaultView
					
					debug.lo('modulePath', service.modulePath);
					service.module = require(service.modulePath);

					//"inherit" service functions...
					if (service.serviceType !== 'soaif') { //for soaif_resources
						nutshellIt(service.module);
					}
				//});
			}
			catch (err) {
				debug.lo('invalid service or resource ' + err);
				return next(err);
			}
			
			//FIX! we can't set it valid here already... //nsReq.status = 'valid'; but probably shouldn't
		} else {
			return next(new Error('invalid or missing service name specified'), null);
			//FIX! remove
			//delete result.modulePath;
		}
	}
	catch (err) {
		nsReq.status = 'invalid';
		debug.log('*** error while parsing service [' + err + ']');
		return next(err, nsReq);
 	}

	next(null, nsReq);
}
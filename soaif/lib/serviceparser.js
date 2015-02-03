require('longjohn');

var debug = require('./debug');
var inflection = require('inflection');
var fs = require('./filesystem');
var util = require('util');
var path = require('path');

function nutshellIt(module) {
	module.getResources = function(nsReq, next) {
		
		var result = require('./tools').collection('resources');

		console.log('OK***********************************');

		for (var name in nsReq.service.module) {
			obj = nsReq.service.module[name];
			if (!!(obj && obj.constructor && obj.call && obj.apply) && name !== 'getResources') {
				//its a function, no lets check for the CRUDs
				if (name.startsWith('get') || name.startsWith('add') || name.startsWith('update') || name.startsWith('delete')) {
					var resource = name.replace('get', '').replace('add', '').replace('udpate', '').replace('delete', '').toLowerCase();
					result.add({ name: resource });
				}
			}
		}

		nsReq.response.data = result.data();
		
		next(nsReq);
		
		//validate
		//nsReq.validateParameters();
		
		//******************* process....		
		//setup search filter
/*		var filter = { artist: artist, limit: limit };
		
		//get the data
		lastfm.searchArtists(filter, function(err, artists) {
			if (err) {
				throw err;
			} else {
				//******************* populate response....

				nsReq.response.data = artists.data();

				// artists.each(function(artist) {
				// 	nsReq.response.data = { artists: { artist: [ { a: true }, { b: false } ] } };
				// });
				//nsReq.response.data = artists;
				
				nsReq.response.status = 'valid';
				
				next(nsReq);
			}
		});*/
	}
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
				service.modulePath = process.cwd() + '/soaif/applicationservices/ns_' + inflection.pluralize(resource) + '.js';
				service.serviceType = 'soaif';
				serviceFound = fs.fileExists(service.modulePath);
				if (!serviceFound) {
					throw new Error('invalid soaif service');
				}
				break;
			default:
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

			try
			{
				debug.lo('modulePath', service.modulePath);
				service.module = require(service.modulePath);

				//"inherit" service functions...
				nutshellIt(service.module);
			}
			catch (err) {
				debug.lo('enterprise module could not be found :( ' + err);
				return next(err, null);
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

	debug.sho(service);

	next(null, nsReq);
}
require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var fs = require('fs');
var util = require('util');


//FIX! IMPLEMENT PROMISES

module.exports = {
	getServices: function(nsReq, next) {
		
		var path;
		var showSOAIF = false;					//this is used to in/exclude the SOAIF_ prefix in the results

		try {
			//******************* setup filters....
			var type = nsReq.getParameter('type', {
				typeName: 'string',
				description: 'service type to retrieve',
				defaultValue: 'enterprise',
				options: ['application', 'enterprise', 'compound', 'soaif']
			}).toLowerCase();

			var name = nsReq.getParameter('name', {
				typeName: 'string',
				description: 'partial service name to search',
				defaultValue: ''
			});

			//validate
			//nsReq.validateParameters();
			
			//******************* process....		
			//setup search filter
			
			//get the data
			var result = tools.collection('service');
			
			switch (type) {
				case 'soaif':
					path = process.cwd() + '/soaif/applicationservices/';
					showSOAIF = true;
					break;
				case 'application':
					path = process.cwd() + '/soaif/applicationservices/';
					break;
				case 'compound':
					path = process.cwd() + '/soaif/compoundservices/';
					break;
				case 'enterprise':
				default:
					path = process.cwd() + '/soaif/enterpriseservices/';
					break;
			}

			var files = fs.readdirSync(path);

			files.makeArray().forEach(function(item) {
				//console.log(util.inspect(item, { showHidden: true, depth: null }));
				var file = fs.lstatSync(path + item);

				var tempParams = nsReq.filter;	//.parameters;
				tempParams.name = item.replace('.js', '');

				//main result
				var service = { 
					name: item.replace('soaif_', '').replace('.js', ''),
					type: type,
					url:  '/nutshell/' + nsReq.service.name + '/' + nsReq.resource.name + '.' + nsReq.resource.output + '?' + require('querystring').stringify(nsReq.parameters)
				}

				//FIX! surely this can be shortenened!!!
				if (file && file.isFile() && item.endsWith('.js') && !item.startsWith('.')) {
					if (showSOAIF) {
						if (item.startsWith('soaif_')) {
							if (name === '') {
								result.add(service);		//.replace('soaif_', '')
							} else {
								if (item.includes(name)) {
									result.add(service);	//.replace('soaif_', '')
								}
							}
						}
					} else {
						if (!item.startsWith('soaif_')) {
							if (name === '') {
								result.add(service);
							} else {
								if (item.includes(name)) {
									result.add(service);
								}
							}
						}
					}					
				};
			});

			nsReq.response.data = result.data();
			nsReq.response.status = 'valid';

			next(null, nsReq);
		}
		catch (err) {
			console.log(err);
			nsReq.response.status = 'invalid';
			//nsReq.setError(err);
			next(err, nsReq);
		}
		finally
		{

		}
	},
	addServices: function(nsReq, next) {
		try {
			
			//******************* setup filters....
			var name = nsReq.getParameter('name', { 
				typeName: 'string', 
				description: 'sericetype',
				defaultValue: 'enterprise'
			});

			var description = nsReq.getParameter('description', { 
				typeName: 'string', 
				description: 'partial artist name to search for',
				defaultValue: 'enterprise'
			});

			var type = nsReq.getParameter('type', { 
				typeName: 'string',
				description: 'partial artist name to search for',
				defaultValue: 'enterprise'
			});

			//validate
			//nsReq.validateParameters();
			
			//******************* process....		
			//setup search filter
			
			next(null, nsReq);
		
		}
		catch (err) {
			console.log(err);
			nsReq.response.status = 'invalid';
			//nsReq.setError(err);
			next(err, nsReq);
		}
	}
}
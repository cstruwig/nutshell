require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var fs = require('fs');
var util = require('util');

module.exports = {
	getServices: function(nsReq, next) {
		
		try {
			
			//******************* setup filters....
			var type = nsReq.getParameter('type', {
				typeName: 'string',
				description: 'service type to retrieve',
				defaultValue: 'enterprise',
				options: ['application', 'enterprise', 'compound', 'soaif']
			});

			//validate
			//nsReq.validateParameters();
			
			//******************* process....		
			//setup search filter
			
			//get the data
			var result = tools.collection('service');
			var path;
			var showSOAIF = false;

			switch (type.toLowerCase()) {
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
				//console.log(util.inspect(file, { showHidden: true, depth: null }));
				if (file && file.isFile() && item.endsWith('.js')) {
					if (showSOAIF) {
						if (item.startsWith('ns_')) {
							result.add({ name: item });	
						}
					} else {
						if (!item.startsWith('ns_')) {
							result.add({ name: item });
						}
					}
					
				};
			});

			nsReq.response.data = result.data();
			nsReq.response.status = 'valid';

			next(nsReq);
		}
		catch (err) {
			console.log(err);
			nsReq.response.status = 'invalid';
			//nsReq.setError(err);
			next(nsReq);
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
			
			next(nsReq);
		
		}
		catch (err) {
			console.log(err);
			nsReq.response.status = 'invalid';
			//nsReq.setError(err);
			next(nsReq);
		}
	}
}
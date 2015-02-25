require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var fs = require('fs');
var util = require('util');


//FIX! IMPLEMENT PROMISES

module.exports = {
	getViews: function(nsReq, next) {
		
		var path = process.cwd() + '/soaif/views/';
		
		try {
			//******************* setup filters....
			var name = nsReq.getParameter('name', {
				typeName: 'string',
				description: 'partial view name to search',
				mandatory: false
			});

			//validate
			//nsReq.validateParameters();
			
			//******************* process....		
			//setup search filter
			
			//get the data
			var result = tools.collection('views');
			var files = fs.readdirSync(path);

			files.makeArray().forEach(function(item) {
				//console.log(util.inspect(item, { showHidden: true, depth: null }));
				var file = fs.lstatSync(path + item);

				// var tempParams = nsReq.filter;	//.parameters;
				// tempParams.name = item.replace('.js', '');

				//main result
				var service = { 
					name: item.replace('.html', '')
				}

				//FIX! surely this can be shortenened!!!
				if (file && file.isFile() && item.endsWith('.html') && !item.startsWith('.')) {
					if (name === '') {
						result.add(service);		//.replace('soaif_', '')
					} else {
						if (item.includes(name)) {
							result.add(service);	//.replace('soaif_', '')
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
	}
}
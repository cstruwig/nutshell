require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var fs = require('fs');
var util = require('util');

module.exports = {

	getRoles: function(nsReq, next) {
		
		try {
			
			//******************* setup filters....
			var name = nsReq.getParameter('name', {
				typeName: 'string',
				description: 'partial role name to search',
				defaultValue: ''
			});

			//validate
			//nsReq.validateParameters();
			
			//******************* process....		
			//setup search filter
			
			//get the data
			var result = tools.collection('roles');

			result.add({ name: 'user' });
			result.add({ name: 'admin' });
			result.add({ name: 'demo' });
			result.add({ name: 'security' });

	// 		nsReq.response.data = result.data();
	// 		nsReq.response.status = 'valid';

	// 		next(null, nsReq);
		}
		catch (err) {
			console.log(err);
			nsReq.response.status = 'invalid';
			//nsReq.setError(err);
			next(err, nsReq);
		}
	}//,
	// addServices: function(nsReq, next) {
	// 	try {
			
	// 		//******************* setup filters....
	// 		var name = nsReq.getParameter('name', { 
	// 			typeName: 'string', 
	// 			description: 'sericetype',
	// 			defaultValue: 'enterprise'
	// 		});

	// 		var description = nsReq.getParameter('description', { 
	// 			typeName: 'string', 
	// 			description: 'partial artist name to search for',
	// 			defaultValue: 'enterprise'
	// 		});

	// 		var type = nsReq.getParameter('type', { 
	// 			typeName: 'string',
	// 			description: 'partial artist name to search for',
	// 			defaultValue: 'enterprise'
	// 		});

	// 		//validate
	// 		//nsReq.validateParameters();
			
	// 		//******************* process....		
	// 		//setup search filter
			
	// 		next(nsReq);
		
	// 	}
	// 	catch (err) {
	// 		console.log(err);
	// 		nsReq.response.status = 'invalid';
	// 		//nsReq.setError(err);
	// 		next(nsReq);
	// 	}
	// }
}
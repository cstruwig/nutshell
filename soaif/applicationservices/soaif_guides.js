require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var fs = require('fs');
var util = require('util');
var path = require('path');

// function getGuideList(role, next) {

// 	// switch (role.toLowerCase()) {
// 	// 	case 'admin':
// 	// 		break;
// 	// 	case 'rules':
// 	// 		break;
// 	// 	case 'governance':
// 	// 		break;
// 	// 	case 'user':
// 	// 	default:
// 	// 		tools.getFileList(process.cwd() + '/soaif/views/guides/users', function(err, list) {
// 	// 			next(err, list);
// 	// 		});
// 	// 		break;
// 	// }

// 	tools.getFileList(process.cwd() + '/soaif/views/guides/' + role, function(err, list) {
// 		return next(err, list);
// 	});
// }

module.exports = {

	//=== generate point for add service stub
	getGuides: function(nsReq, next) {
		
		try {
			//******************* setup filters....
			var role = nsReq.getParameter('role', {
				typeName: 'list',
				description: 'service type to retrieve',
				defaultValue: 'user',
				options: ['user', 'admin', 'rules', 'governance', 'monitoring']
			});

			//validate
			//nsReq.validateParameters();
			
			//******************* process....		
			//setup search filter
			
			//get the data
			var result = tools.collection('guide');	//=== generate point for add service stub
			var guidePath = tools.getURL(nsReq.req, { excludePath: true }) + '/nuthshell';

			tools.getFileList(process.cwd() + '/soaif/views/guides/' + role, function(err, list) {
				list.each(function(ctr, item) {
					result.add({ name: item.name, url: guidePath + '/guides/' + role + '/' + item.name });
				});

				nsReq.response.data = result.data();
				nsReq.response.status = 'valid';

				next(null, nsReq);
			});
		}
		catch (err) {
			nsReq.response.status = 'invalid';
			next(err, nsReq);
		}
	}
}
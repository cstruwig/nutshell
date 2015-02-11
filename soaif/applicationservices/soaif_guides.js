require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var fs = require('fs');
var util = require('util');
var path = require('path');

function getGuideList(audience, next) {

	switch (audience.toLowerCase()) {
		case 'admin':
			break;
		case 'rules':
			break;
		case 'governance':
			break;
		case 'user':
		default:
			tools.getFileList(process.cwd() + '/soaif/views/guides/users', function(err, list) {
				next(err, list);
			});
			break;
	}
}

module.exports = {

	//=== generate point for add service stub
	getGuides: function(nsReq, next) {
		
		try {
			//******************* setup filters....
			var audience = nsReq.getParameter('audience', {
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
			var guidePath = tools.getURL(nsReq.req, { excludePath: true });

			tools.getFileList(process.cwd() + '/soaif/views/guides/' + audience, function(err, list) {
				list.each(function(ctr, item) {
					result.add({ name: item.name, url: guidePath + '/guides/' + audience + '/' + item.name });
				});

				nsReq.response.data = result.data();
				nsReq.response.status = 'valid';

				next(nsReq);
			});
		}
		catch (err) {
			console.log(err);
			nsReq.response.status = 'invalid';
			//nsReq.setError(err);
			next(nsReq);
		}
	}
}
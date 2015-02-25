require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var fs = require('fs');
var util = require('util');


//FIX! IMPLEMENT PROMISES

module.exports = {
	getLinks: function(nsReq, next) {
		
		try {
			//******************* setup filters....
			var account = nsReq.getParameter('account', {
				typeName: 'string',
				description: 'user account to get links for',
				mandatory: true
			});

			//validate
			//nsReq.validateParameters();
			
			//******************* process....		
			//setup search filter
			
			//get the data
			var result = tools.collection('links');

			ns.db.open(function(err, connection) {
				if (err) return next(null);	//FIX!
				connection.collection('userLinks').find({ account: { $regex: account.toLowerCase() } }).toArray(function(err, results) {

					results.forEach(function(item) {
						var record = {
							url: item.link,
							description: item.description
						}
						result.add(record);
					});
					connection.close();
					
					nsReq.response.data = result.data();
					nsReq.response.status = 'valid';

					return next(null, nsReq);
				});
			});

		}
		catch (err) {
			console.log(err);
			nsReq.response.status = 'invalid';
			//nsReq.setError(err);
			next(err, nsReq);
		}
	}
}
//require('longjohn');

var ns = require('../lib');

var google = require('../applicationservices/google');
// var bing = require('../applicationservices/bing');
// var yahoo = require('../applicationservices/yahoo');

module.exports = {
	getResults: function(nsReq, next) {
	
		try {
			//******************* setup filters....
			var query = nsReq.getParameter('query', { 
				typeName: 'string',
				mandatory: true,
				description: 'your web search query'
			});
			
			//validate
			//nsReq.validateParameters();
			
			//******************* process....		
			//setup search filter
			var googleQuery = { query: query };
			
			//get the data

			google.searchGoogle(googleQuery, function(err, webResults) {
				if (err) {
					throw err;
				} else {
					//******************* populate response....

					// artists.each(function(artist) {
					// 	nsReq.response.data = { artists: { artist: [ { a: true }, { b: false } ] } };
					// });

					nsReq.response.data = webResults.data();
					//nsReq.response.data = artists;
					
					nsReq.response.status = 'valid';
					
					next(nsReq);
				}
			});


//			bing.searchBing(filter, )

		}
		catch (err) {
			console.log(err);
			nsReq.response.status = 'invalid';
			//nsReq.setError(err);
			next(nsReq);
		}
	}
}
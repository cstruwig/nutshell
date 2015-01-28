//require('longjohn');

var ns = require('../lib');
var twitter = require('../applicationservices/twitter');

module.exports = {
	getUpdates: function(nsReq, next) {
		try {
			console.log('socialmedia -> getUpdates');

			//******************* setup filters....
			var account = nsReq.getParameter('account', { 
				typeName: 'complex', 
				mandatory: true, 
				description: 'in the format: { platform: "twitter" account: "sunfork_com" }' 
			});

			//validate
			//nsReq.validateParameters();

			//******************* process....
			//setup search filter
			var filter = { account: 'axnosis' };

			//get the data
			twitter.getTweets(filter, function(err, tweets) {
				console.log('s');
				if (err) {
					console.log('err');
					throw err;
				} else {
					console.log('no error');
					//******************* populate response....

					nsReq.response.data = artists.data();
					nsReq.response.status = 'valid';
					
					next(nsReq);
				}
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
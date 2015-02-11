require('longjohn');

var ns = require('../lib');
var openWeather = require('../applicationservices/openweather');
var ns = require('../soaif/nutshelljs/0.0.1/package');
var lastfm = require('../enterprise/music');

exports.findBand = function() {
	try {
		//******************* setup filters....
		var artist = nsReq.getParameter('artist', { 
			typeName: 'string', 
			mandatory: true, 
			description: 'partial artist name to search for'
		});
		
		//validate
		//nsReq.validateParameters();
		
		//******************* process....		
		//setup search filter
		var filter = { artist: artist };
		
		//get the data
		grooveshark.searchArtists(filter, function(err, artists) {
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
		});
	}
	catch (err) {
		console.log(err);
		nsReq.response.status = 'invalid';
		//nsReq.setError(err);
		next(nsReq);
	}
}
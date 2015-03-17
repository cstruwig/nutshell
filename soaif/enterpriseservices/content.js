require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var lastfm = require('../applicationservices/lastfm');
var omdb = require('../applicationservices/omdb');

exports.getArtists = function(nsReq, next) {

	//******************* setup filters....
	var name = nsReq.getParameter('name', { 
		typeName: 'string', 
		mandatory: true, 
		description: 'partial artist name to search for'
	});

	var limit = nsReq.getParameter('limit', { 
		typeName: 'number', 
		mandatory: false, 
		description: 'maximum no of results to return from music source',
		defaultValue: 10
	});

	var deferred = ns.Q.defer();

	//******************* validate filters
	// if (nsReq.helping) {
	// 	return next(nsReq.education);
	// }

	if (!nsReq.validFilter()) {
		//return epty results
		nsReq.response.data = ns.tools.collection('artists');
		nsReq.response.status = 'invalid';
		deferred.resolve(nsReq);
	} else {
		//******************* process....		
		//setup search filter
		var filter = { name: name, limit: limit };
		
		//get the data
		lastfm.searchArtists(filter, function(err, artists) {
			if (err) {
				deferred.reject(err);
			} else {
				//******************* populate response....
				nsReq.response.data = artists.data();
				nsReq.response.status = 'valid';

				deferred.resolve(nsReq);
			}
		});
	}

	return deferred.promise.nodeify(next);
}
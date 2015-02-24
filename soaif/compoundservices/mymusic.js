require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var entertainment = require('../enterpriseservices/entertainment');

function _searchArtists(bandName) {

	//map the abstract inputs to the application specific inputs
	var bandQuery = {
		name: bandName
	}

	var deferred = ns.Q.defer();

	//call the application service
	entertainment.getArtists(bandQuery, function(err, collection) {
		if (err) deferred.reject(err);
		else {
			//convert/transform raw data to abstract form
			var results = ns.tools.collection('results');
			collection.each(function(ctr, resource) {

				var result = {
					name: resource.title,
					description: resource.description,
					url: resource.link,
					source: 'google'				
				}

				results.add(result);
			});

			deferred.resolve(null, results.data());
		}
	});

	return deferred.promise;
}

function _searchMovies(filter) {

	//map the abstract inputs to the application specific inputs
	var googleQuery = {
		query: filter.searchterm || 'where do babies come from',
		maxResults: filter.maxResults || 200
	}

	var deferred = ns.Q.defer();

	//call the application service
	google.search(googleQuery, function(err, collection) {
		if (err) deferred.reject(err);
		else {
			//convert/transform raw data to abstract form
			var results = ns.tools.collection('results');
			collection.each(function(ctr, resource) {

				var result = {
					name: resource.title,
					description: resource.description,
					url: resource.link,
					source: 'google'				
				}

				results.add(result);
			});

			deferred.resolve(null, results.data());
		}
	});

	return deferred.promise;
}

exports.findbands = function(nsReq, next) {
	
	//******************* setup filters....
	var searchterm = nsReq.getParameter('searchterm', {
		typeName: 'string',
		mandatory: true, 
		description: 'artist or movie name'
	});

	var allPromise = ns.Q.all([ 
		_searchArtists(nsReq.filter),
		_searchMovies(nsReq.filter)
	]);

	allPromise.then(function(allResults) {
		//success
		var allPromiseResults = allResults[0].results.result.concat(allResults[1].results.result);
		var finalResult = ns.tools.collection('results');

		finalResult.add(allPromiseResults);
	
		nsReq.response.status = 'valid';
		nsReq.response.data = finalResult.data();

		return next(null, nsReq);	
	}, function() {
		//error
		nsReq.response.status = 'invalid';
		nsReq.response.data = ns.tools.collection('results');
		
		return next(new Error('not sure'), nsReq);	
	});
	
}
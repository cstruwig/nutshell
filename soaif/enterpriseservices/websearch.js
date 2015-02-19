//PROMISES!!!!! read this article
//http://strongloop.com/strongblog/promises-in-node-js-with-q-an-alternative-to-callbacks/

require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var google = require('../applicationservices/google');
var duckduckgo = require('../applicationservices/duckduckgo');
// var bing = require('../applicationservices/bing');
// var yahoo = require('../applicationservices/yahoo');

module.exports = {
	getResults: function(nsReq, next) {

		//******************* setup filters....
		var query = nsReq.getParameter('query', {
			typeName: 'string',
			mandatory: true,
			description: 'your web search query'			
		});

		var maxResults = nsReq.getParameter('maxResults', { 
			typeName: 'int',
			description: 'the maximum number of results returned',
			defaultValue: 100,	
			maxValue: 1000
		});

		//validate
		//nsReq.validateParameters();
		
		//******************* process...
		//setup search filter

		var allPromise = ns.Q.all([ 
			_searchGoogle(nsReq.filter), 
			_searchDuckDuckGo(nsReq.filter)
		]);

		allPromise.then(function(allResults) {
			//success

			var allPromiseResults = allResults[0].results.result.concat(allResults[1].results.result);
			var finalResult = ns.tools.collection('results');

			finalResult.add(allPromiseResults);
		
			nsReq.response.status = 'valid';
			nsReq.response.data = finalResult.data();

			return next(nsReq);	
		}, function() {
			//error
			nsReq.response.status = 'invalid';
			nsReq.response.data = ns.tools.collection('results');
			
			return next(nsReq);	
		});
	}
}

function _searchGoogle(filter) {

	//map the abstract inputs to the application specific inputs
	var googleQuery = {
		query: filter.query || 'where do babies come from',
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

			deferred.resolve(results.data());
		}
	});

	return deferred.promise;
}

function _searchDuckDuckGo(filter) {

	//map the abstract inputs to the application specific inputs
	var duckDuckGoFilter = {
		searchTerm: filter.query || 'is coffee fattening'
	}

	var deferred = ns.Q.defer();

	//call the application service
	duckduckgo.instantAnswer(duckDuckGoFilter, function(err, collection) {
		if (err) deferred.reject(err);
		else {

			//convert/transform raw data to abstract form
			var results = ns.tools.collection('results');
			collection.each(function(ctr, resource) {

				var result = {
					name: resource.title,
					description: resource.description,
					url: resource.link,
					source: 'duckduckgo'			
				}

				results.add(result);
			});

			deferred.resolve(results.data());
		}
	});

	return deferred.promise;
}
require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var google = require('google');

exports.search = function(filter, next) {

	var query = filter.query || 'i must work hard because';
	var maxResults = filter.maxResults || 50;		//FIX! filter.extract()...
	
	var result = tools.collection('results');
	var nextCounter = 0;

	google.resultsPerPage = 25;
	google(query, function(err, next2, links) {
		if (err) return next(err);

		for (var i = 0; i < links.length; ++i) {
			var googleResult = {
				title: links[i].title,
				description: links[i].description,
				link: links[i].link
			};

			result.add(googleResult);
		}

		//run 4 times
		//FIX! limit as per maxResults
		// if (nextCounter < 4) {
		// 	nextCounter += 1;
			//if (next2) next2();
			return next(null, result);
		//}
	});
};
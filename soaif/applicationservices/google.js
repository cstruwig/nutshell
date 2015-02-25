require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var google = require('google');

exports.search = function(filter, next) {

	var query = filter.query || 'i must work hard because';
	var maxResults = filter.maxResults || 50;
	
	var result = tools.collection('results');

//***************************************************************************************************
// return next(null, result);		//bypass search logic below and return...
//***************************************************************************************************

	google.resultsPerPage = 25;
	google(query, function(err, next2, links) {
		if (err) return next(err);

		for (var i = 0; i < links.length; ++i) {
			var googleResult = {
				title: links[i].title,
				description: links[i].description,
				link: links[i].link
			};

			if (googleResult.link !== null) {
				result.add(googleResult);	
			}
		}

		return next(null, result);
	});
};
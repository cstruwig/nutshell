require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var google = require('google');

exports.searchGoogle = function(filter, next) {

	var filter = {
		query: filter.query || ''
	}

	var result = tools.collection('googleLinks');
	var nextCounter = 0;

	google.resultsPerPage = 25;
	google(filter.query, function(err, otherNext, links) {
		if (err) console.error(err);

		for (var i = 0; i < links.length; ++i) {

			var gLink = {
				title: links[i].title,
				description: links[i].description,
				url: links[i].link
			}

			result.add(gLink);
		}

		//return after 4
		if (nextCounter < 4) {
			nextCounter += 1;
			//if (otherNext) otherNext();
			return next();
		}

		return next(null, result);
	});
};

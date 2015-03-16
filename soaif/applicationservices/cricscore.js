var ns = require('..//lib');

var debug = ns.debug;
var tools = ns.tools;

var apiUrl = 'http://cricscore-api.appspot.com';

exports.availableMatches = function(filter, next) {

	var result = tools.collection('matches');
	var url = apiUrl + '/csa';
//If-Modified-Since:Sun, 30 Jun 2013 23:58:22 IST
	ns.request(url, function (err, response, body) {
		if (err || response.statusCode !== 200) {
			debug.log('some error' + err);
			throw new Error('some error' + err);
		} else {
			var matches = JSON.parse(body);
			if (matches) {
				for (var match in matches) {

					var matchInfo = matches[match];

					result.add({
						ref: matchInfo.id,
						team1: conditions.main,
						team2: conditions.wind
					});

				}
			}

			return next(null, result);
		}
	});
};

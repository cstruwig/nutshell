require('longjohn');

var ns = require('../lib');

var debug = ns.debug;
var tools = ns.tools;

var apiUrl = 'http://www.omdbapi.com/?r=json&';

exports.searchMovies = function(filter, next) {

	var result = tools.collection('forecast');
	var url = apiUrl + 'type=movie&s=' + filter.name + '&y=' + filter.year;

	var result = tools.collection('movies');

	ns.request(url, function (err, response, body) {
		if (err || response.statusCode !== 200) {
			debug.log('some error' + err);
			throw new Error('some error' + err);
		} else {

			var movies = JSON.parse(body).Search;

			// //FIX! validate
			movies.makeArray().forEach(function(item) {
				var movie = {
					ref: item.imdbID,
					name: item.Title,
					year: item.Year,
					//type: item.Type,
					url: 'http://www.imdb.com/title/' + item.imdbID
				};

				result.add(movie);

			});

			return next(null, result);
		}		  	
	});	
};
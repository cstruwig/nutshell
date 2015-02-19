require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;

var apiUrl = 'http://www.omdbapi.com/?r=json&';

exports.searchMovies = function(filter, next) {

	var result = tools.collection('forecast');
	var url = apiUrl + 'type=movie&s=' + filter.name + '&y=' + filter.year;

	var result = tools.collection('movies');

	if (!filter.name || filter.name === '') {
		next(new Error('invalid or empty name specified'));
	}

	ns.request(url, function (err, response, body) {
		if (err || response.statusCode !== 200) {
			return next(err);
		} else {


			console.log(err);
			var movies;

			try {
				//if (response )
				movies = JSON.parse(body).Search;
			} catch (err) {
				console.log(err);
				movies = {};
			}

			console.log(movies, '1111');

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
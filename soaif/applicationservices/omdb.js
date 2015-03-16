require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;

var apiUrl = 'http://www.omdbapi.com/?r=json&';

exports.searchMovies = function(filter, next) {

	var url = apiUrl + 'type=movie&s=' + filter.name;
	var result = tools.collection('movies');


	// if (!filter.name || filter.name === '') {
	// 	next(new Error('invalid or empty name specified'));
	// }

	if (filter.year > 0) {
		url += '&y=' + filter.year;
	}

	ns.request(url, function (err, response, body) {
		if (err || response.statusCode !== 200) {
			return next(err);
		} else {
			var movies = [];
			
			var data = JSON.parse(body);

			if (data && data.Search) {
				movies = data.Search;
				movies.makeArray().forEach(function(item) {
					
					var movie = {
						ref: item.imdbID,
						name: item.Title,
						year: item.Year,
						//type: item.Type,
						url: 'http://www.imdb.com/title/' + item.imdbID
					};
					
					if (item && item.image) {
						item.image.forEach(function(image) {
							if (image['#text'] !== '' && image.size === 'mega') {
								artist.image = image['#text'];
							}
						});
					}

					result.add(movie);
				});
			}

			return next(null, result);
		}
	});	
};
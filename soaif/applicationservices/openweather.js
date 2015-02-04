var ns = require('..//lib');

var debug = ns.debug;
var tools = ns.tools;


var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?';

exports.getForecast = function(filter, next) {

	var result = tools.collection('forecast');
	var url = apiUrl + 'q=' + filter.city;

	ns.request(url, function (err, response, body) {
		if (err || response.statusCode !== 200) {
			debug.log('some error' + err);
			throw new Error('some error' + err);
		} else {
			
			var movies = JSON.parse(body).results.artistmatches.artist;

			//FIX! validate
			artists.makeArray().forEach(function(item) {
				
				var artist = {
					name: item.name,
					url: item.url,
					image: ''
				};
				
				item.image.forEach(function(image) {
					if (image['#text'] !== '' && image.size === 'mega') {
						artist.image = image['#text'];
					}
				});

				result.add(artist);	
		}		  	
	});

	//var result = tools.collection('tweets');
	
};
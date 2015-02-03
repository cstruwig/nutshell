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
			
			var data = JSON.parse(body);

			var forecast = {
				city: filter.city,
				summary: data.weather[0].main,
				description: data.weather[0].description
			};

			result.add(forecast);

			return next(null, result);
		}		  	
	});

	//var result = tools.collection('tweets');
	
};
var ns = require('..//lib');

var debug = ns.debug;
var tools = ns.tools;

var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?';

exports.getCityForecase = function(filter, next) {

	var result = tools.collection('conditions');
	var url = apiUrl + 'q=' + filter.city || 'durban';

	ns.request(url, function (err, response, body) {
		if (err || response.statusCode !== 200) {
			debug.log('some error' + err);
			throw new Error('some error' + err);
		} else {
			var conditions = JSON.parse(body);

			if (conditions && !conditions.message) {
				result.add({
					//date: conditions.dt,
					name: conditions.name,
					url: 'http://www.openstreetmap.org/#map=11/' + conditions.coord.lat + '/' + conditions.coord.lon,
					country: conditions.sys.country,
					latitude: conditions.coord.lat,
					longitude: conditions.coord.lon,
					sunrise: conditions.sys.sunrise,
					sunset:  conditions.sys.sunset,
					summary: conditions.weather.main,
					description: conditions.weather.description,
					temperature: conditions.main,
					wind: conditions.wind
				});	
			}

			return next(null, result);
		}
	});
};
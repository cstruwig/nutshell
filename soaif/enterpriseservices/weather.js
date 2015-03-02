require('longjohn');

var ns = require('../lib');
var openWeather = require('../applicationservices/openweather');

module.exports = {
	getConditions: function(nsReq, next) {
	
		try {
			//******************* setup filters....
			var place = nsReq.getParameter('place', { 
				typeName: 'string', 
				mandatory: true,
				description: 'place name for weather condition search'
			});

			var xyz = nsReq.getParameter('xyz', { 
				typeName: 'string', 
				mandatory: true,
				description: 'enter xyz'
			});
			
			//validate
			//if (!nsReq.validInputs) {
			// 	return next(new Error('Invalid inputs'), null);
			//}
			
			//******************* process....		
			//setup search filter
			var filter = { city: place };
			
			//get the data
			openWeather.getCityForecase(filter, function(err, forecast) {
				if (err) {
					throw err;
				} else {
					//******************* populate response....

					nsReq.response.data = forecast.data();
					nsReq.response.status = 'valid';
					
					next(null, nsReq);
				}
			});
		}
		catch (err) {
			console.log(err);
			nsReq.response.status = 'invalid';
			next(err, nsReq);
		}
	}
}
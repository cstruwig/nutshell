Template.weather.helpers({
	forecasts: function () {
		console.log('getting forecasts...');
		Meteor.call('getData', 'weather/forecasts', 'city=sandton', function(err, result) {
			console.log(result.forecasts.forecast);
			Session.set('forecasts', result.forecasts);
		});

		return Session.get('forecasts');
	}
});
Template.services.helpers({
	services: function() {

		//Meteor.call('getData', 'music/artist', 'artist=waldo', function(err, results) {
		//Meteor.call('getData', 'weather/forecasts', 'city=sandton', function(err, forecasts) {

		//Session.set('services', [ { name: 'fetching...' }]);

		Meteor.call('getData', 'soaif/services', function(err, result) {
			Session.set('services', result.services.service);
		});

		return Session.get('services');
	}
});
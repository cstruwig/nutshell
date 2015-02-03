Template.services.helpers({
	services: function () {
	  //Meteor.call('getData', 'music/artist', 'artist=waldo', function(err, results) {
	  Meteor.call('getData', 'weather/forecasts', 'city=sandton', function(err, forecasts) {
	      Session.set('getData', forecasts.forecast);
	  });

	  return Session.get('getData');
	}
});
Template.music.helpers({
	artists: function() {
		

		return Session.get('artists');
	}
});

Template.music.events({
	'blur .artistquery': function(evt, tmpl) {
		var searchTerm = $('.artistquery').val() || '';
		if (searchTerm !== '') {
			console.log('searching... [' + searchTerm + ']');

			Meteor.call('getData', 'music/artist', 'artist=' + searchTerm, function(err, results) {
				console.log(results);
				Session.set('artists', results.artists.artist);
			});
		}
	}
});

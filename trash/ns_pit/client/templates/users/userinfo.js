Template.userinfo.helpers({
	currentUser: function() {
		return Meteor.user();
	},
	vsj: function () {
		var user = Meteor.user();
		if (user) {
			if (user.hasOwnProperty('profile')) {
				return user.profile.name;  
			} else if (user.hasOwnProperty('emails')) {
				return user.emails[0].address;  
			}
		} else {
			return 'guest';
	  	}
	}
});


Template.userinfo.events({
	'click .user': function () {
	 	console.log(Meteor.user());
		// increment the counter when button is clicked
		Session.set('counter', Session.get('counter') + 1);
	}
});
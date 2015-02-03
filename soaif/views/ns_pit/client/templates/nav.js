Template.nav.helpers({
	counter: function () {
	  return Session.get('counter');
	}
});

// Template.nav.events({
// 	'click button': function () {
// 		console.log(Meteor.user());
// 		// increment the counter when button is clicked
// 		Session.set('counter', Session.get('counter') + 1);
// 	},
// 	'click ul.nav>li>a[class!=dropdown-toggle]': function(evt, tmpl) {
// 		console.log(tmpl);
// 	}
// });




Template.shell.rendered = function() {
	console.log('this._rendered=' + this._rendered);
    if(!this._rendered) {
    	console.log('running...');
		this._rendered = true;
		$('#myTab a[role="tab"]').each(function(ctr, item) {
			console.log('activating all tabs' + ctr);
		});	
    }
};
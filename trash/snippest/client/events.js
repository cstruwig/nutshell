Template.nav.events({
	'click .addInterest': function(evt, tmpl) {
		evt.preventDefault();
		Session.set('adding_interest', true);
	}
})
// Template.main.rendered = function() {
// 	setTimeout(function() {
// 		masonize(function() {

// 		});	
// 	}, 500);
// }
Template.addform.events({
	'click .save': function(evt, tmpl) {
		
		Articles.insert({
			name: tmpl.find('.name').value, 
			description: tmpl.find('.description').value, 
			url: tmpl.find('.url').value, 
			height: randomInt(150, 400)
		});

		Session.set('adding_interest', false);
	},
	'click .cancel': function(evt, tmpl) {
		Session.set('adding_interest', false);
	},
	'click .close': function(evt, tmpl) {
		Session.set('adding_interest', false);
	}
})

Template.Articles.events({
	'click .like': function(evt, tmpl) {
		var curLike = Likes.findOne({muser:Meteor.userId(), article:})	
	});

})

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function masonize(cb) {
	var container = $('#mainContent');
	container.masonry({
		itemSelector: '.item',
		gutter: 20
	});
	if (cb) {
		cb();
	}
}
Template.main.helpers({
	adding_interest: function() {
		return Session.get('adding_interest');
	},
	articles: function() {
		return Articles.find();
	}
})
Template.article.helpers({
	numlikes: function() {

		return 0;//Likes.find({article.this._id}).count();
	},
	likesthis: function() {
		var doesLike = false;//Likes.findOne({muser:Meteor.userId(), article:this:_id});
		if (doesLike) {
			return 'You liked this!';
		}
	}
})
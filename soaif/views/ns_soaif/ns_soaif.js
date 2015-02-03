Artists = new Mongo.Collection('artists');

var path = 'music/artist';

if (Meteor.isClient) {

  Session.setDefault('searching', false);

  Tracker.autorun(function() {  
    if (Session.get('query')) {
      console.log('subscribing to [artistsSearch]');
      var searchHandle = Meteor.subscribe('artistsSearch', path, Session.get('query'));
      Session.set('searching', !searchHandle.ready());
    }
  });

  Template.body.events({
    'submit form': function(event, template) {
      console.log('submitted form');
      event.preventDefault();
      var query = template.$('input[type=text]').val();
      if (query) {
        console.log('search query = ' + query);
        Session.set('query', query);
      }
    }
  });

  Template.body.helpers({  
    artists: function() {
      console.log('issuing data to template');
      return Artists.find();
    },
    searching: function() {
      console.log('status enquiry...');
      return Session.get('searching');
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish('artistsSearch', function(path, query) {  
    
    var self = this;
    try {
      var response = HTTP.get('http://localhost:8080/nutshell/' + path, {
        params: {
          artist: query
        }
      });

      console.log('finished searching...');

      var data = JSON.parse(response.content);

      _.each(data.artists.artist, function(artist) {
        console.log(artist.name);
        var doc = {
          name: artist.name,
          url: artist.url,
          image: artist.image
        };

        self.added('artists', Random.id(), doc);
      });

      console.log('ready...');
      self.ready();

    } catch (error) {
      console.log('error:' + error);
    }
  });
}
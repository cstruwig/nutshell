//require('longjohn');

var ns = require('../lib');
var lastfm = require('../applicationservices/lastfm');
var omdb = require('../applicationservices/omdb');
var youtube = require('../applicationservices/youtube');
//var grooveshark = require('../applicationservices/grooveshark');

module.exports = {
	getArtists: function(nsReq, next) {

		//******************* setup filters....
		var name = nsReq.getParameter('name', { 
			typeName: 'string', 
			mandatory: true, 
			description: 'partial artist name to search for'
		});

		var limit = nsReq.getParameter('limit', { 
			typeName: 'number', 
			mandatory: false, 
			description: 'maximum no of results to return from music source',
			defaultValue: 10
		});
		
		//******************* validate filters
		if (nsReq.invalidFilter()) {
			nsReq.response.data = ns.tools.collection('artists');
			nsReq.response.status = 'invalid';
			return next(nsReq);
		}
		
		//******************* process....		
		//setup search filter
		var filter = { name: name, limit: limit };
		
		//get the data
		lastfm.searchArtists(filter, function(err, artists) {
			if (err) {
				throw err;
			} else {
				//******************* populate response....

				nsReq.response.data = artists.data();

				// artists.each(function(artist) {
				// 	nsReq.response.data = { artists: { artist: [ { a: true }, { b: false } ] } };
				// });
				//nsReq.response.data = artists;
				
				nsReq.response.status = 'valid';
				
				next(nsReq);
			}
		});
	},
	getMovies: function(nsReq, next) {
		
		//******************* setup filters....
		var name = nsReq.getParameter('name', { 
			typeName: 'string', 
			mandatory: true, 
			description: 'partial movie name to search for'
		});

		var year = nsReq.getParameter('year', { 
			typeName: 'number', 
			mandatory: false, 
			description: 'year of release'
		});
		
		//******************* validate filters
		if (nsReq.invalidFilter()) {
			nsReq.response.data = ns.tools.collection('movies');
			nsReq.response.status = 'invalid';
			return next(nsReq);
		}
		
		//******************* process....		
		//setup search filter
		var filter = { name: name, year: year };
		
		//get the data
		omdb.searchMovies(filter, function(err, movies) {
			if (err) {
				throw err;
			} else {
				//******************* populate response....
				nsReq.response.data = movies.data();
				nsReq.response.status = 'valid';
				
				next(nsReq);
			}
		});
	},
	getVideos: function(nsReq, next) {

		//******************* setup filters....
		var query = nsReq.getParameter('query', { 
			typeName: 'string', 
			mandatory: true, 
			description: 'video search query'
		});
		
		//validate
		//nsReq.validateParameters();
		
		//******************* process....		
		//setup search filter
		var filter = { query: query };
		
		//get the data
		youtube.searchVideos(filter, function(err, movies) {
			if (err) {
				throw err;
			} else {
				//******************* populate response....
				nsReq.response.data = movies.data();
				nsReq.response.status = 'valid';
				
				next(nsReq);
			}
		});
	}
}
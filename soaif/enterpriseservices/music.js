//require('longjohn');

var ns = require('../lib');
var lastfm = require('../applicationservices/lastfm');
//var grooveshark = require('../applicationservices/grooveshark');

module.exports = {
	getArtists: function(nsReq, next) {
	
		try {
			//******************* setup filters....
			var artist = nsReq.getParameter('artist', { 
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
			
			//validate
			//nsReq.validateParameters();
			
			//******************* process....		
			//setup search filter
			var filter = { artist: artist, limit: limit };
			
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
		}
		catch (err) {
			console.log(err);
			nsReq.response.status = 'invalid';
			//nsReq.setError(err);
			next(nsReq);
		}
	}
}

// module.exports = {
// 	getArtists: function(nsReq, next) {
// 		
// 		try {
// 			//async tracking...
// 			var mainArtists = {};
// 		
// 			var artist = nsReq.getParameter('artist', { 
// 				typeName: 'string', 
// 				mandatory: true, 
// 				description: 'partial artist name to search for'
// 			});
// 			
// 			//search filter
// 			var filter = { artist: artist };
// 			
// 			//x(getArtists).then(foreach(getTracks(artist)));
// 
// 			//find matching artists
// 			lastfm.searchArtists(filter, function(err, artists) {
// 				if (err) {
// 					debug.log('errrsssss' + err); //don't throw throw err;
// 					doneProcessingArtist(err);
// 				} else {
// 					
// 					mainArtists = artists;
// 
// 					//for each artist
// 					artists.each(function(index, artist) {
// 
// 						//add the tracks collection for each artist
// 						artist.tracks = ns.tools.collection('track');
// 						
// 						//get top tracks for each artist
// 						lastfm.getTopTracks({ artist: artist.name }, function(err, tracks) {
// 							if (err) {
// 								debug.log(err); //don't throw throw err;
// 								doneProcessingArtist(err);
// 							} else {
// 
// 								tracks.each(function(i, track) {
// 									console.log(track.name);
// 									artist.tracks.add(track.name);
// 								});
// 								
// 								artist.done = true;
// 								doneProcessingArtist();
// 							}
// 						});
// 						
// 					});		//each
// 				}
// 			});
// 			
// 			function doneProcessingArtist(err) {
// 
// 				if (err) {
// 								
// 					next(err, nsReq);
// 				} else {
// 
// 					mainArtists.each(function(i, artist) {
// 						console.log(i);
// /*						if (!artist.hasOwnProperty('done')) {
// 							console.log('1');
// 							return;
// 						} else {
// 							console.log('12222');							
// 							nsReq.response.status = 'valid';
// 							nsReq.response.data = mainArtists;
// 
// 
// 							next(null, nsReq);	
// 						}*/
// 					});
// 					
// 				}
// 			}
// 		}
// 		catch (err) {
// 			console.log('some effing error ' + err);
// 			next(err, nsReq);
// 		}
// 	}
// }
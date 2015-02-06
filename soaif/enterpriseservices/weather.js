//require('longjohn');

var ns = require('../lib');
var openWeather = require('../applicationservices/openweather');

module.exports = {
	getConditions: function(nsReq, next) {
	
		try {
			//******************* setup filters....
			var name = nsReq.getParameter('name', { 
				typeName: 'string', 
				mandatory: true,
				description: 'city name for weather search'
			});
			
			//validate
			//nsReq.validateParameters();
			
			//******************* process....		
			//setup search filter
			var filter = { city: name };
			
			//get the data
			openWeather.getCityForecase(filter, function(err, forecast) {
				if (err) {
					throw err;
				} else {
					//******************* populate response....

					nsReq.response.data = forecast.data();

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


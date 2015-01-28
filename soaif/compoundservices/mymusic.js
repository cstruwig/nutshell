require('longjohn');

var ns = require('../soaif/nutshelljs/0.0.1/package');
var lastfm = require('../enterprise/music');

exports.findBand = function() {
	try {
			//******************* setup filters....
			var artist = nsReq.getParameter('artist', { 
				typeName: 'string', 
				mandatory: true, 
				description: 'partial artist name to search for'
			});
			
			//validate
			//nsReq.validateParameters();
			
			//******************* process....		
			//setup search filter
			var filter = { artist: artist };
			
			//get the data
			grooveshark.searchArtists(filter, function(err, artists) {
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

// 	recommendSong: function(nsReq, next) {

// 		nsReq.req.log.info('function started');

// 		lastfm.getArtists('cher', function(data) {
// 			nsReq.req.log.info('done with last fm');
// 		});

// //		var nsRes = ns.listener.newResponse(nsReq);

// 		//ns.debug.log('hi. inside getClaims.');
		
// 		//ns.debug.stop(nsReq.id);
// 		return next('got the claim...');
// 	},
// 	getPolicies: function(nsReq, cb) {
// 		//ns.debug.log('yo... inside getPolicies');
// 		//res.write('xyz/123321');
// 		//res.header('x', 'sa');
// 		//ns.debug.log('done()');
// 		return next('got the POLICIES...');
// 	},
// }

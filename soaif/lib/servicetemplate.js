require('longjohn');

var ns = require('../soaif/lib');

var calendarService = require('../enterprise/calendarService');    // **forms part of nutshell
var service2 = require('../application/service2');
var service3 = require('../enterprise/service');


//service name					: <a>proactiveInvoicingGuidanceService</a> //probably myservice1 :)
//what it does					: <a>sends me an email 4 days before invoice-day. and attaches the previous 3 invoices too.</a>
//curated <a>v0.1</a> 			: generates and distibutes offline views (reports)
//curated <a>v0.1</a>			: 
//service type					: hybrid //report || view || action || hybrid
//author						: <a>hardus</a> - <a data="otherstuffauthordid">2014-07-20</a>
//usage							: <a>once a month</a>

module.exports = {
	getOrders: function(nsReq, next) {
		
		try {
		
			//setup filters //RESERVED : ref, description, etc...
			ns.filter({ 
				dataSources : ns.collection('invoices'
				recipient
			} 

			//process
			
			ns.dates.yesterday()
			var invoices = finance.invoice.get({ dateFrom: now-4}
			var views = ns.collection()

			
			//formulate result
			ns.noResult();
			
			nsReq.getParameter('artist', { 
				typeName: 'string', 
				mandatory: true, 
				description: 'partial artist name to search for'
			});
			
			var mainArtists = {};
			var filter = {
				artist: artist
			};

			applicationservice.searchObjects(filter, function(err, artists) {
				if (err) {
					console.log('errrsssss' + err);
					//don't throw throw err;
					//??
				} else {
					mainArtists = artists;
					trackOperationCount = artists.length;
					console.log('run for:' + trackOperationCount);
					(artists || []).forEach(function(artist) {
					
						filter = {
							artist: artist.name
						};
						
						artist.tracks = [];

						//get top tracks
						lastfm.getTopTracks(filter, function(err, tracks) {
							if (err) {
								//don't throw throw err;
								//log('failed to get top tracks for artist');
							} else {
								(tracks || []).forEach(function(track) {
									console.log(track);
									artist.tracks.push(track.name);
								});	
								
								finishedOnce();
							}
						});
					});
				}
			});
			
			function finishedOnce() {
				
				trackOperationCount--;
				console.log(trackOperationCount);
				if (trackOperationCount === 0) { //both done
					nsReq.response.status = 'valid';
					nsReq.response.data = mainArtists;
					next(null, nsReq);
				}
			}
		}
		catch (err) {
			next(err, null);
		}
	}
}

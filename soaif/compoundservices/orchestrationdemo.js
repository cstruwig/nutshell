require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var nsRequest = require('../lib/nsrequest');
var entertainment = require('../enterpriseservices/entertainment');

exports.infatuations = function(nsReq, next) {

	var result = ns.tools.collection('results');
	var obsession = nsReq.getParameter('name', {
		typeName: 'string',
		mandatory: true,
		description: 'your unhealthy obsession'
	});

	//setup getArtists()
	var artistReq = nsRequest.init(nsReq.req);
	nsRequest.parse(artistReq, function(err, result) {
		if (err) return nsReq(err, nsReq);
		
		artistReq.getParameter('name', { value: obsession });
	});
	var artists = entertainment.getArtists(artistReq);
	
	//setup getMovies()
	var movieReq = nsRequest.init(nsReq.req);
	nsRequest.parse(movieReq, function(err, result) {
		if (err) return nsReq(err, nsReq);

		movieReq.getParameter('name', { value: obsession });
	});
	var movies = entertainment.getMovies(movieReq);
	
	//get the data
	var allPromise = ns.Q.all([artists, movies]);

	//process the data!
	allPromise.spread(function(artistD, movieD) {

		artistD.response.data.artists.artist.forEach(function (item) {
			var artistItem = {
				name: item.name,
				url: item.url,
				type: 'artist'
			}
			result.add(artistItem);
		});

		movieD.response.data.movies.movie.forEach(function (item) {
			var movieItem = {
				name: item.name,
				url: item.url,
				type: 'movie'
			}
			result.add(movieItem);
		});

		nsReq.response.status = 'valid';
		nsReq.response.data = result.data();
		
		return next(null, nsReq);
	},
	function(err) {
		//error
		nsReq.response.status = 'invalid';
		nsReq.response.data = result.data();

		return next(err, nsReq);	
	});
}

// exports.braaiSpots = function(nsReq, next) {

// 	var result = ns.tools.collection('results');
// 	var obsession = nsReq.getParameter('name', {
// 		typeName: 'string',
// 		mandatory: true,
// 		description: 'your unhealthy obsession'
// 	});

// 	//setup getArtists()
// 	var artistReq = nsRequest.init(nsReq.req);
// 	nsRequest.parse(artistReq, function(err, result) {
// 		if (err) return nsReq(err, nsReq);
		
// 		artistReq.getParameter('name', { value: obsession });
// 	});
// 	var artists = entertainment.getArtists(artistReq);
	
// 	//setup getMovies()
// 	var movieReq = nsRequest.init(nsReq.req);
// 	nsRequest.parse(movieReq, function(err, result) {
// 		if (err) return nsReq(err, nsReq);

// 		movieReq.getParameter('name', { value: obsession });
// 	});
// 	var movies = entertainment.getMovies(movieReq);
	
// 	//get the data
// 	var allPromise = ns.Q.all([artists, movies]);

// 	//process the data!
// 	allPromise.spread(function(artistD, movieD) {

// 		artistD.response.data.artists.artist.forEach(function (item) {
// 			var artistItem = {
// 				name: item.name,
// 				url: item.url,
// 				type: 'artist'
// 			}
// 			result.add(artistItem);
// 		});

// 		movieD.response.data.movies.movie.forEach(function (item) {
// 			var movieItem = {
// 				name: item.name,
// 				url: item.url,
// 				type: 'movie'
// 			}
// 			result.add(movieItem);
// 		});

// 		nsReq.response.status = 'valid';
// 		nsReq.response.data = result.data();
		
// 		return next(null, nsReq);
// 	},
// 	function(err) {
// 		//error
// 		nsReq.response.status = 'invalid';
// 		nsReq.response.data = result.data();

// 		return next(err, nsReq);	
// 	});
// }
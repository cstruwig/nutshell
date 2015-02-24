require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var lastfm = require('../applicationservices/lastfm');
var omdb = require('../applicationservices/omdb');

exports.getArtists = function(nsReq, next) {

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

	var deferred = ns.Q.defer();

	//******************* validate filters
	// if (nsReq.helping) {
	// 	return next(nsReq.education);
	// }

	if (nsReq.invalidFilter()) {
		//return epty results
		nsReq.response.data = ns.tools.collection('artists');
		nsReq.response.status = 'invalid';
		deferred.resolve(nsReq);
	} else {
		//******************* process....		
		//setup search filter
		var filter = { name: name, limit: limit };
		
		//get the data
		lastfm.searchArtists(filter, function(err, artists) {
			if (err) {
				deferred.reject(err);
			} else {
				//******************* populate response....
				nsReq.response.data = artists.data();
				nsReq.response.status = 'valid';

				deferred.resolve(nsReq);
			}
		});
	}

	return deferred.promise.nodeify(next);
}

exports.getMovies = function(nsReq, next) {
	
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
	
	var deferred = ns.Q.defer();

	//******************* validate filters
	if (nsReq.invalidFilter()) {
		nsReq.response.data = ns.tools.collection('movies');
		nsReq.response.status = 'invalid';
		deferred.resolve(nsReq);
	} else {
		//******************* process....		
		//setup search filter
		var filter = { name: name, year: year };
		
		//get the data
		omdb.searchMovies(filter, function(err, movies) {
			if (err) {
				deferred.reject(err);
			} else {
				//******************* populate response....
				nsReq.response.data = movies.data();
				nsReq.response.status = 'valid';
				
				deferred.resolve(nsReq);
			}
		});
	}
	
	return deferred.promise.nodeify(next);	
}




// getVideos: function(nsReq, next) {

// 	//******************* setup filters....
// 	var query = nsReq.getParameter('query', { 
// 		typeName: 'string', 
// 		mandatory: true, 
// 		description: 'video search query'
// 	});
	
// 	//validate
// 	//nsReq.validateParameters();
	
// 	//******************* process....		
// 	//setup search filter
// 	var filter = { query: query };
	
// 	//get the data
// 	youtube.searchVideos(filter, function(err, movies) {
// 		if (err) {
// 			throw err;
// 		} else {
// 			//******************* populate response....
// 			nsReq.response.data = movies.data();
// 			nsReq.response.status = 'valid';
			
// 			next(nsReq);
// 		}
// 	});
// }








// exports.help = function() {

// 	var proxy = {};

// 	for (var name in this) {
// 		if (name !== 'help') {

// 			//FIRST! call the service for educational purposes
// 			var nsReq = require('../lib/nsrequest').init();
// 			var filter = {};
// 			nsReq.helping = true;
// 			this[name].call(this, nsReq, function(education) {
// 				//so we called the service and now we know how the filter must look
// 				if (education) {
// 					for (var input in education) {
// 						//update the education! maybe...
// 						education[input].value = arguments[education[input].ordinal];
					
// 						//FIX! do type checking here!	
// 						filter[education[input].name] = arguments[education[input].ordinal];
// 					}

// 					console.log('filter', filter);
// 				} else {
// 					console.log('thinking...');
// 					return;  //FIX!
// 				}
// 			});

// 			proxy[name] = function() {
// 				// interception code
// 				//debug.sho(arguments);
// 				console.log('intercept', filter);
// 				return this[name];
// 			}
// 		}
// 	};

// 	return proxy;
// }

// exports.help2 = function() {
// 	var helperCalls = {};

// 	//dynamically create a promised version of all functions
// 	for (var functionName in this) {
// 		if (functionName !== 'help') {			//ignore this one!

// 			//create the helper "proxy"
// 			helperCalls[functionName] = function() {
// 				console.log('sss');

// 				if (arguments[0] !== 'yo') {
// 					this[functionName].apply(this, arguments, function() {
// 						return 'x';
// 					});
// 				} else {
// 					return { x: 's', y: 123 };	
// 				}

				
// 			}

// 			// var nsReq = require('../lib/nsrequest').init();
// 			// nsReq.helping = true;

// 			// //call the service for educational purposes
// 			// this[functionName].call(this, nsReq, function(education) {

// 			// 	//so we called the service and now we know how the filter must look
// 			// 	if (!education) {
// 			// 		console.log('error while HELPING ' + functionName + '()');
// 			// 		//FIX! handle this!!!
// 			// 		return;
// 			// 	}
				
// 			// 	//create the helper "proxy"
// 			// 	helperCalls[functionName] = function() {

// 			// 		// var filter = {};
// 			// 		// for (var input in education) {
// 			// 		// 	//update the education! maybe...
// 			// 		// 	education[input].value = arguments[education[input].ordinal];
					
// 			// 		// 	//FIX! do type checking here!	
// 			// 		// 	filter[education[input].name] = arguments[education[input].ordinal];
// 			// 		// }

// 			// 		// // console.log('invoking...');
// 			// 		// // this[functionName].call(this, filter, function(result) {
// 			// 		// // //helperCalls[functionName].call(helperCalls, filter, function(result) {
// 			// 		// // 	console.log('invoke callback', result);
// 			// 		// // });
// 			// 		// // console.log('invoked...');

// 			// 		// console.log(functionName);
// 			// 		console.log('return');
// 			// 		return this[functionName].apply(this, arguments);

// 			// 		//this[functionName].call(this, { name: 'martin' }, function(results) {
// 			// 			// console.log('results');
// 			// 			// return;
// 			// 		//});

// 			// 		//return this[functionName];
// 			// 	}

// 			// 	console.log('gone!!!');
// 			// });
// 		}
// 	}

// 	return helperCalls;
// }
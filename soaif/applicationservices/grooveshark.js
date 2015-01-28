require('longjohn');

var ns = require('../soaif/lib');
var tools = ns.tools;
var apiSearch = 'http://tinysong.com/s/';
var apiUrl = '?format=json&limit=10&key=3e863f6d123ce0704b82ab0f2b4ea7c0';

exports.searchArtists = function (artistName, next) {
	artistName = 'carcass';
	var url = apiSearch + artistName + apiUrl;
	
	var result = tools.collection('artist');
	
	try {
		ns.request(url, function (err, response, body) {
			if (err || response.statusCode !== 200) {
				throw new Error('connectivity error ' + err);
			} else {
			
			var artists = JSON.parse(body);//.results.artistmatches.artist;
//			console.log(artists);
			return next();

				/*{ Url: 'http://tinysong.com/1cVcA',
    SongID: 39119844,
    SongName: 'Proof of an Art Object',
    ArtistID: 1821661,
    ArtistName: 'Norwegian Arms',
    AlbumID: 9005298,
    AlbumName: 'Wolf Like a Stray Dog' }*/
				//FIX! validate
				artists.forEach(function(item) {
					
					var artist = {
						name: item.name,
						url: item.url,
						image: ''
					};
					
					item.image.forEach(function(image) {
						if (image['#text'] !== '' && image.size === 'mega') {
							artist.image = image['#text'];
						}
					});

					result.add(artist);					
				});
				
				return next(null, result);
			}		  	
		});
	}
	catch (err) {
		return next(err, null);
	}
};

exports.searchTrack = function (artistName, next) {
	//ns.initApp();

	var url = apiUrl + '&method=artist.getInfo&artist=' + artistName;
	ns.request(url, function (error, response, body) {

	  if (!error && response.statusCode == 200) {

		var result = JSON.parse(body);
		var artists = [];

		ns.debug.log('ss');
//		console.log(util.inspect(result));
//		for(var x in result.results.artistmatches) {
			//artists.push()
//			console.log(result.artist);
//		}

		return next(body);
	  } else {
		  console.log('lastfm failure ' + error);
	  	return next();
	  }
	});
};

exports.getArtists = function (artistName, next) {

	//ns.initApp();

	var url = apiUrl + '&method=artist.getInfo&artist=' + artistName;
	ns.request(url, function (error, response, body) {

	  if (!error && response.statusCode == 200) {

		var result = JSON.parse(body);
		var artists = [];

		ns.debug.log('ss');
//		console.log(util.inspect(result));
//		for(var x in result.results.artistmatches) {
			//artists.push()
//			console.log(result.artist);
//		}

		return next(body);
	  } else {
		  console.log('lastfm failure ' + error);
	  	return next();
	  }
	});
};



exports.getSimilarArtists = function (artistName, next) {
	var url = apiUrl + '&method=artist.getsimilar&artist=' + artistName;
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		return next(body);
	  } else {
	  	return next();
	  }
	});
};

exports.getArtistTracks = function (artistName, next) {
	var url = apiUrl + '&method=artist.getsimilar&artist=' + artistName;
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		return next(body);
	  } else {
	  	return next();
	  }
	});
};

exports.getArtistAlbums = function (artistName, next) {
	var url = apiUrl + '&method=artist.getsimilar&artist=' + artistName;
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		return next(body);
	  } else {
	  	return next();
	  }
	});
};
require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;

var apiUrl = 'http://ws.audioscrobbler.com/2.0/?api_key=' + ns.setting('APIKEY_LASTFM') + '&format=json';

exports.searchArtists = function(filter, next) {

	var url = apiUrl + '&method=artist.search&artist=' + (filter.name || '');
	url += '&limit=' + (filter.limit < 1 ? 10 : filter.limit);

	var result = tools.collection('artist');
	
	ns.request(url, function (err, response, body) {
		if (err || response.statusCode !== 200) {
			debug.log('some error' + err);
			throw new Error('some error' + err);
		} else {
			var artists = [];
			var data = JSON.parse(body);

			if (data && data.results && data.results.artistmatches) {
				artists = JSON.parse(body).results.artistmatches.artist;
			}

			//FIX! validate

			artists.makeArray().forEach(function(item) {
				
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
};

exports.getTopTracks = function (filter, next) {
	var url = apiUrl + '&method=artist.gettoptracks&artist=' + (filter.artist || '');
	url += '&limit=' + 3; //+ filter.size || 10;

	var result = tools.collection('tracks');
	
	try {
		ns.request(url, function (err, response, body) {
			if (err || response.statusCode !== 200) {
				throw new Error('some error' + err);
			} else {
				var tracks = JSON.parse(body).toptracks.track;

				tracks.forEach(function(item) {
					result.add({ name: item.name });
				});
				
				return next(null, result);
			}		  	
		});
	}
	catch (err) {
		return next(err, null);
	}
}

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
require('longjohn');

var ns = require('../lib');

var debug = ns.debug;
var tools = ns.tools;

var YouTube = require('youtube-node');
var youTube = new YouTube();

exports.searchVideos = function(filter, next) {

	var result = tools.collection('videos');
	var query = filter.query || '';

	youTube.setKey(ns.setting('APIKEY_YOUTUBE'));
	youTube.search(query, 12, function(resultData) {

		console.log(resultData);

		// var videos = JSON.parse(body).Search;

		// // //FIX! validate
		// videos.makeArray().forEach(function(item) {
		// 	var video = {
		// 		ref: item.imdbID,
		// 		title: item.Title,
		// 		year: item.Year,
		// 		//type: item.Type,
		// 		url: 'http://www.imdb.com/title/' + item.imdbID
		// 	};

		// 	result.add(video);

		// });

		return next(null, result);
	});

};
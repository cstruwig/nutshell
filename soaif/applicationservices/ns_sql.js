var ns = require('..//lib');

// var auth = new require('oauth').OAuth(
// 	'https://api.twitter.com/oauth/request_token',
// 	'https://api.twitter.com/oauth/access_token',
// 	'vkH63VwSGPC3o49i3oVnTOfky',
// 	'Bhi0AnClhmRK3DMZmdkj1WFnOAps5kv44C4wTvqqSZJeprA4hX',
// 	'1.0A',
// 	null,
// 	'HMAC-SHA1'
//);

var Twitter = require('twitter');
//var Twitter = require('../soaif/node_modules/twitter/lib/twitter.js');
//var Twit = require('../soaif/node_modules/twit');
//var OAuth = require('oauth');

var debug = ns.debug;
var tools = ns.tools;

// exports.getTweets4 = function(filter, next) {

// 	console.log('sssssssssssssss');
// 	var account = 'sunfork_com';

// 	var auth = new OAuth.OAuth(
// 		'https://api.twitter.com/oauth/request_token',
// 		'https://api.twitter.com/oauth/access_token',
// 		'8Q984mFnqyE8eP2oT8zOw',
// 		'e28el70NwnEtERMxv0kwICRakxAlr5ZHeWgcaNqP8',
// 		'1.0A',
// 		null,
// 		'HMAC-SHA1'
// 	);

// 	auth.get(
// 		'https://api.twitter.com/1.1/search/tweets.json?count=50&q=' + account,
// 		'1464975770-khNtNk6CUxkcjUjIoRPse3IGkQeuQSY5US2fH1r',
// 		'hedKT1ZLETDvIWN8a8keIc8BA1YifvWxvw84fH80t0U',
// 		function(error, data, res) {
// 			console.log('___________________sssssssssssssss');
// 			if (error) {
// 				debug.sho(error);
// 				console.log('****************');
// 				throw error;
// 			} else {
// 				console.log('twitter callback success...');
// 				debug.sho(data);
// 				next();
// 			}
// 		}
// 	);
// }

// exports.getTweets2 = function(filter, next) {

// 	var T = new Twit({
//     	consumer_key: 'vkH63VwSGPC3o49i3oVnTOfky',
// 		consumer_secret: 'Bhi0AnClhmRK3DMZmdkj1WFnOAps5kv44C4wTvqqSZJeprA4hX',
// 		access_token: '1464975770-cNOOdcXgfAeh14QxwzeVfe6lo3sMJVZ0StjNK3j',
// 		access_token_secret: 'rgQIDn48T9jXjMlTCfQMLvBZzxQn1MFBKMkyrRru1mWgt'
// 	});

// 	var params = { q: 'banana since:2014-11-11', count: 100 };
// 	T.get('search/tweets', params, function(error, tweets, response){
// 		//debug.sho(error);
// 		//debug.sho(tweets);
// 		debug.sho(response);	
// 		if (error) {
// 			debug.sho(error);
// 			throw error;
// 		} else {
// 			console.log(tweets);
// 			next(null, {})
// 		}
// 	});
// }

exports.getTweets = function(filter, next) {

	//var result = tools.collection('tweets');
	
	try {
		var client = new Twitter({
			consumer_key: 'vkH63VwSGPC3o49i3oVnTOfky',
			consumer_secret: 'Bhi0AnClhmRK3DMZmdkj1WFnOAps5kv44C4wTvqqSZJeprA4hX',
			access_token_key: '1464975770-cNOOdcXgfAeh14QxwzeVfe6lo3sMJVZ0StjNK3j',
			access_token_secret: 'rgQIDn48T9jXjMlTCfQMLvBZzxQn1MFBKMkyrRru1mWgt'
		});

		//var params = { screen_name: filter.account || 'sunfork_com' };
		var params = { screen_name: 'sunfork_com' };
		//var params = { user_id: 1464975770 };
		//var params = {};

		//client.get('favorites/list', function(err, tweets, response) {
		client.get('statuses/user_timeline.json', params, function(err, tweets, response) {
			console.log('twitter -> getTweets');
			if (err) {
				console.log('err');
				debug.sho(tweets);
				throw new Error('some error' + err);
			} else {
				console.log(tweets);

				//var artists = JSON.parse(body).results.artistmatches.artist;
				
				//FIX! validate
				/*artists.forEach(function(item) {
					
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
				});*/
				
				return next(null, result);
			}
		});
	}
	catch (err) {
		return next(err, null);
	}
};
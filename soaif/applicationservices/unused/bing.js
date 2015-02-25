require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var bing = require('bing-api');

exports.bingFind = function(filter, next) {
console.log('1');
	var query = filter.query || 'i must work hard because';
	var maxResults = filter.maxResults || 50;		//FIX! filter.extract()...

	var client = new bing.SearchClient({ appId: 'x/Mm5yvAKbUYmDKuWke7YWMALFkP6ly+I1PXoHwVTeg=' }); //53bdhDYa+4Hnfe2xyZPDXPq0Q2vyVFVt+FzDuqACJPA' });

	client.search(query, function(error, response, data) {
		console.log('1111');
		if (!error && response.statusCode == 200)
		{
			console.log('122313212');
			console.log(data.SearchResponse.Web.Results[0].Url);
		} else {
			console.log('err');
			debug.sho(error);
			console.log("ERROR! " + error + "/" + response.statusCode);
		}

	});
};
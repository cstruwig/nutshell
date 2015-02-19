require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var DDG = require('node-ddg-api').DDG;
var ddg = new DDG('nutshell');

exports.instantAnswer = function(filter, next) {

	var searchTerm = filter.searchTerm || 'i must work hard because';
	var result = tools.collection('results');
	
	ddg.instantAnswer(searchTerm, {skip_disambig: '0'}, function(err, response) {
		if (err) return next(err);

		response.RelatedTopics.forEach(function(item) {

			console.log(item);

			var ddgResult = {
				title: item.Text,
				description: '',
				link: item.FirstURL
			};

			result.add(ddgResult);
		});
		
		return next(null, result);
	});
};
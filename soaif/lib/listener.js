require('longjohn');

var util = require('util');
var fs = require('./filesystem');
var inflection = require('inflection');
var debug = require('./debug');

exports.setupRequest = function(req, res, next) {

	var nsRequest = require('./nsrequest');
	var nsReq = nsRequest.init(req, res);
	
	nsRequest.parse(nsReq, function(err, result) {
		if (err) {
			debug.log('failed to parse request [' + err + ']');
			next(err, null);
		} else {
			next(null, nsReq);
		}
	});
}

exports.preServeRequest = function(nsReq, next) {
	next();
}

exports.serveRequest = function(nsReq, next) {
	//cb will called from ???
	//nsReq.callback = next;

	try
	{
		debug.log('****** serving request' + nsReq.resource.functionName);
		nsReq.service.module[nsReq.resource.functionName].call(nsReq.service.module, nsReq, function(nsReq) {
			next(null, nsReq);
		});
	}
	catch (err) {
		debug.log('failed to serve request [' + err + ']');
		next(err, null);
	}
}

exports.postServeRequest = function(nsReq, next) {
	next();
}

exports.loadView = function(nsReq) {

	var contentBuffer;
	var viewSource;

	try {
		var path = '../views/' + nsReq.options.view + '.html';		//__dirname + '/../views/' + nsReq.options.view + '.html';
		if (fs.fileExists(path)) {
			contentBuffer = fs.readFile(path);
		} else {
			contentBuffer = fs.readFile(__dirname + '/../views/default.html');	
		}
		
		viewSource = contentBuffer.toString();
		viewData = viewSource.replace('<!-- nsData -->', 'var nsData = ' + JSON.stringify(nsReq.response.data) + ';');

		return viewData;
	}
	catch (err) {
		return '<h1>o moer...</h1>sorry...';
	}
}
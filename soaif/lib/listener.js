require('longjohn');

var util = require('util');
var fs = require('./filesystem');
var inflection = require('inflection');
var debug = require('./debug');
var tools = require('./tools');
var db = require('./db');

exports.setupRequest = function(req, res, next) {

	var nsRequest = require('./nsrequest');
	var nsReq = nsRequest.init(req, res);

	//nsReq.host = options.host || 'n/a';
	
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
		//debug.log('****** serving request' + nsReq.resource.functionName);
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

		if (nsReq.options.view === 'default') {
			// console.log('view=default');
			nsReq.options.view = nsReq.resource.name;
		}

		//var path = '../views/' + nsReq.options.view + '.html';
		var path = __dirname + '/../views/' + nsReq.options.view + '.html';

		if (fs.fileExists(path)) {
			//console.log('fileExists');
			contentBuffer = fs.readFile(path);
		} else {
			console.log('view doesn\'t exist, using default instead [requested=' + nsReq.options.view + ']');
			contentBuffer = fs.readFile(__dirname + '/../views/default.html');	
		}

		viewSource = contentBuffer.toString();
		viewData = viewSource.replace('/* #nsData */', 'var nsData = ' + JSON.stringify(nsReq.response.data) + ';');

		return viewData;
	}
	catch (err) {
		return '<h1>o moer...</h1>sorry...';
	}
}

exports.authIt = function(options) {

	function parseAuthorization(req, res, next) {

		var userId = -1;

		//if nsReqGod
		if (options === 'nsReqGod') {
			//nsReqGod
		}

		//req.userFB = require('./roles.json');

		//if authorized
		//get user's roles PLUS their services and resources
		var email = 'japie@company.co.za';			//FIX! this will be available once login function is finalized!

		// db.read({ table: 'user' }, function(data) {
		// 	userId = 123321;
			
		// 	debug.log('user is *** AUTHORISED ***');
		// 	debug.sho(data);
			
		// 	//set the userId from FB
		// 	req.userId = userId;
			
			return (next());
		// });

	}

	return (parseAuthorization);
}
require('longjohn');

var util = require('util');
var fs = require('./filesystem');
var inflection = require('inflection');
var debug = require('./debug');
var tools = require('./tools');
var db = require('./db');

exports.setupRequest = function(req, next) {

	var nsRequest = require('./nsrequest');
	var nsReq = nsRequest.init(req);
	nsRequest.parse(nsReq, function(err, result) {
		if (err) {
			next(err);
		} else {
			next(null, nsReq);
		}
	});
}

exports.preServeRequest = function(nsReq, next) {
	return next();
}

exports.serveRequest = function(nsReq, next) {
	//cb will called from ???
	//nsReq.callback = next;

	var timer = Date.now();

	try
	{
		var functionName = '';
		var serviceName = '';

		if (nsReq.options.model !== '') {
			serviceName = nsReq.service.name + '.' + nsReq.resource.functionName;
			functionName = nsReq.options.model;
			debug.lo('custom model specified', serviceName + '.' + functionName + '()');
		} else {
			serviceName = nsReq.service.name;
			functionName = nsReq.resource.functionName;
		}

		nsReq.service.module[functionName].call(nsReq.service.module, nsReq, function(err, nsReq) {
			debug.lo('result', 'OK');
			return next(null, nsReq);
		});
	}
	catch (err) {
		debug.lo('result', 'FAILED!');
		if (err == 'TypeError: Cannot call method \'call\' of undefined') {
			//FIX! hack!
			err = new Error('InvalidResourceError: Cannot call \'' + functionName + '\' of \'' + serviceName + '\'. make sure it exists and/or check your spelling...', 'a', 'b');
		}
		
		debug.log(nsReq.ref + ' failed to serve request [' + err + ']');
		return next(err, nsReq);
	}
	finally
	{
		timer = Date.now() - timer;
		debug.lo('elpased time', timer + 'ms');
		debug.log(nsReq.ref + ' invoked service');
	}
}

exports.postServeRequest = function(nsReq, next) {
	return next();
}

exports.loadView = function(nsReq) {

	var contentBuffer;
	var viewSource;

	try {
		console.log('x', nsReq.options.view);
		if (nsReq.options.view === 'default') {
			console.log('xx', nsReq.options.educateme);
			if (nsReq.options.educateme) {
				console.log('xxx');
				nsReq.options.view = 'default_education';		//FIX! this can be overriden when a default is loaded from db
			} else {
				console.log('xxss');
				nsReq.options.view = nsReq.service.name + '_' + nsReq.resource.name;	
				console.log('defaulting view name : ', nsReq.options.view);
			}
			console.log('xyz');
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
		viewData = viewSource.replace('/** #nsData */', 'var nsData = ' + JSON.stringify(nsReq.response.data) + ';');

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
//look at:
//require('heapdump'); - heapdump.writeSnapshot();
//slc simple cluster tool

require('longjohn');


var restify = require('restify');
var ns = require('./soaif/lib');		//require('nuthselljs');
var debug = ns.debug;
var listener = ns.listener;
var db = ns.db;

function serveResponse(nsReq, res, options, next) {

	try {
		var contentLengthPlaceHolder = '{{N_S|S_N}}';
		var code = options.code || 200;
		var content = options.content || '<html><body>sunfork</body></html>';
		var view = options.view || 'default';	//FIX! lookup default
		var contentType = options.contentType || 'text/html';
		var customHeaders = options.customHeaders || {};				//see options-from-service-override-mechanis below...
		var path = options.path || ''; //  default to blank rather  './index.html'

		//modify response for request options eg. educateme...
		if (nsReq) {

			if (nsReq.options.educateme) {
				console.log('...about to school your ass!');
				nsReq.response.data.education = nsReq.education;
				nsReq.response.data.options = nsReq.options;
			}

			nsReq.response.data.request = nsReq.request;
			nsReq.response.data.request.ref = nsReq.ref;
			nsReq.response.data.request.inputs = nsReq.filter;			//was params
			nsReq.response.data.request.user = { ref: 123321, account: 'hardus@sunfork.com' };			//FIX! DEMO HACK!!
			nsReq.response.data.request.size = contentLengthPlaceHolder;
			//nsReq.response.data.user = nsReq.req.userFB;

			nsReq.response.data.request.time = Date.now() - nsReq.date;			//KEEP THIS LAST ...for accuracy :)
			
			//FIX! options-from-service-override-mechanism goes here... i.e. call from service : nsReq.override('output', 'html'); to override options.contentType below...
			switch (nsReq.resource.output) {
				case 'xml':
					contentType = 'text/xml';
					content = require('js2xmlparser')('data', nsReq.response.data);
					//console.log('length', content.length-contentLengthPlaceHolder.length);
					content = content.replace(contentLengthPlaceHolder, content.length);
					break;
				//FIX!
				//case 'atom':
				//case 'rss':
				case 'view':
					contentType = 'text/html';
					//nsReq.response.data.request.size = nsReq.response.data.length;			//FIX! DEMO HACK!!
					content = listener.loadView(nsReq) || 'niks nie';
					content = content.replace(contentLengthPlaceHolder, content.length);
					break;
				case 'json':
				default:
					contentType = 'application/json';
					content = JSON.stringify(nsReq.response.data);	
					content = content.replace(contentLengthPlaceHolder, content.length);
					//nsReq.response.data.request.size = nsReq.response.data.length;			//FIX! DEMO HACK!!
					//console.length()
					break;
			}
		} else {
			contentType = 'application/json';
			content = JSON.stringify(content);
			content = content.replace(contentLengthPlaceHolder, content.length);
		}

		res.writeHead(code, {
			'Access-Control-Allow-Origin': '*',
			'Content-Length': Buffer.byteLength(content),
			'Content-Type': contentType
		});

		res.write(content);
		res.end();

		next(null, { status: 'done' });
	} 
	catch (err) {
		next(err, { status: 'error', err: err });
	}
}

function processRequest(req, res, next) {
	try {
		listener.setupRequest(req, function(err, nsReq) {
			if (err) {

				debug.log(req.id() + ' failed to parse request');
				ns.metrics.addCounter('badRequestReceived');
				serveResponse(nsReq, res, { content: 'INVALID_REQUEST' }, function(err) {			//...unsupported protocol (unauthorized, or unknown path)
					return next(err);
				});
			}

			listener.serveRequest(nsReq, function(err, nsReq) {
				if (err) {
					debug.log(nsReq.ref + ' err...');
					ns.metrics.addCounter('serveResponseFailed');
					//ALWAYS SERVE!? (non-serviam - hehe)
					serveResponse(nsReq, res, { content: 'FAILURE' }, function(err) {					
						return next();
					});	
				}
			
				//debug.log(nsReq.ref + 'deliver results');
				//served the request without
				serveResponse(nsReq, res, { code: 200 }, function(err, nsReq) {
					ns.metrics.addCounter('responseServed');

					if (err) {
						debug.log(nsReq.ref + ' err...');
						return next(err);
					}

					if (nsReq.status !== 'valid') {

					} else {

					}
					
					return next();
				});
			});
		});
	}
	catch (err) {
		console.log('exit6');
		// serveResponse(nsReq, { content: 'unexpected error [err=' + err + ']' }, function() {
		// 	next(err, null);
		// });
		//res.content = 'unexpected error [err=' + err + ']';
		ns.metrics.addCounter('unexpectedErrorOccurred');
		//errorRequest();
		return next(err)
	}
}

//****************************************************************
//FIX! hack - clear the log files on startup...
require('fs').writeFile('./logs/trace.log', '{ "started": "... nutshell server ..." }\n', function() { console.log ('done'); });
//****************************************************************

var server = restify.createServer({ name: 'nutshell listener' });
var userFB = {};

server.use(restify.queryParser());
server.use(restify.authorizationParser());

var middleware = function(options) {

	//ns.metrics.addCounter('receivedRequest');
	
	function _middleware(req, res, next) {
		console.log(req.id() + ' request received ' + req.path() + ' (serving as ' + options + ')');
		ns.metrics.addRequest(req.path(), function(err, inserted) {
			console.log('sssdb!!', req.path());	
		});
	 	return (next());	
	}

	return (_middleware);
}

var logIt = function(message) {

	function _logIt(req, res, next) {
		console.log('SERVING: ' + req.path() + ' (' + message + ')');
		return (next());
	}

	return (_logIt);
}

var nutshellLandingUrl = '/nutshell/soaif/services.view';

var redirect = function(options) {

	var options = {
		url: options.url || nutshellLandingUrl
	};

	function _redirect(req, res, next) { 
		//debug.log('*** REDIRECTING FROM "' + req.path() + '"');
		//var roles = 'user';	//lookup from req.session.user or req.user._id;
	    res.header('Location', options.url); // + '/?type=' + roles);
		res.send(302, 'welcome to nutshell...');
		return next();
	}

	return (_redirect);
}

server.get({ path: '/favicon.ico', name: 'favicon' }, [middleware('favicon'), restify.serveStatic({ directory: process.cwd() + '/soaif/views/assets/' }) ]);
server.get({ path: /assets\/.*/, name: 'asset' }, [middleware('asset'), restify.serveStatic({ directory: process.cwd() + '/soaif/views' }) ]);
server.get({ path: /guides\/.*/, name: 'guide' }, [middleware('guide'), restify.serveStatic({ directory: process.cwd() + '/soaif/views' }) ]);
server.get({ path: '/nutshell/:service/:resource', name: 'nutshellRequest' }, [middleware('nsReq'), listener.authIt(), processRequest]);
//server.get({ path: '/adminMe', name: 'nutshellRequestGod' }, [middleware('nsReqGod'), listener.authIt('nsReqGod'), processRequest]);
server.get({ path:  /.*/, name: 'lander' }, 
	function(req, res, next) { 
		debug.log('*** REDIRECT! *** [url=' + req.path() + ']');
		//var roles = 'user';	//lookup from req.session.user or req.user._id;
	    res.header('Location', nutshellLandingUrl);
		res.send(302, 'welcome to nutshell...');
		ns.metrics.addCounter('redirected');
		return next();
	}
);

function errorRequest(req, res, cb) {
	console.log('errorRequest');
	var body = '<html><body>unknown</body></html>';
	//var body = '<html><body>' + res.content || 'unknown' + '</body></html>';
	res.writeHead(200, {
  		'Content-Length': Buffer.byteLength(body),
  		'Content-Type': 'text/html'
	});
	res.write(body);
	res.end();
	cb();
}

server.on('NotFound', errorRequest);              // When a client request is sent for a URL that does not exist, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 404 handler. It is expected that if you listen for this event, you respond to the client.
server.on('MethodNotAllowed', errorRequest);      // When a client request is sent for a URL that does exist, but you have not registered a route for that HTTP verb, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 405 handler. It is expected that if you listen for this event, you respond to the client.
server.on('VersionNotAllowed', errorRequest);     // When a client request is sent for a route that exists, but does not match the version(s) on those routes, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 400 handler. It is expected that if you listen for this event, you respond to the client.
server.on('UnsupportedMediaType', errorRequest);  // When a client request is sent for a route that exist, but has a content-type mismatch, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 415 handler. It is expected that if you listen for this event, you respond to the client.
server.on('InternalError', errorRequest);

server.listen(8080, '127.0.0.1', function() {
	console.log('nutshell RESTful listener started...\naccepting requests @ %s\n', server.url);
});




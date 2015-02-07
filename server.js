/*
o fok...
--------
service catalogue
settings
logs
diagnostics/testing
views

create compound service
*/


//if (process.env.NODE_ENV !== 'production'){
//	require('longjohn');
//}

var restify = require('restify');
var ns = require('./soaif/lib');		//require('nuthselljs');
var debug = ns.debug;
var listener = ns.listener;

function serveResponse(nsReq, options, next) {

	try {

		options = {
			code: options.code || 200,
			content: options.content || '<html><body>sunfork</body></html>',
			view: options.view || 'default',	//FIX! lookup default
			contentType: options.contentType || 'text/html',
			customHeaders: options.customHeaders || {},				//see options-from-service-override-mechanis below...
			path: options.path || '' //  default to blank rather  './index.html'
		};

		//modify response for request options eg. educateme...
		if (nsReq.options.educateme) {
			nsReq.response.data['education'] = nsReq.education;
		}

		nsReq.response.data.request = nsReq.request;
		nsReq.response.data.request.time = 2;
		nsReq.response.data.request.size = 222;
		nsReq.response.data.request.params = nsReq.parameters;

		nsReq.response.data.user = nsReq.req.userFB;
	
		//FIX! options-from-service-override-mechanism goes here... i.e. call from service : nsReq.override('output', 'html'); to override options.contentType below...
		switch (nsReq.resource.output) {
			case 'xml':
				options.contentType = 'text/xml';
				console.log(nsReq.response.data);
				options.content = require('js2xmlparser')('data', nsReq.response.data);
				break;
			//FIX!
			//case 'atom':
			//case 'rss':
			case 'view':
				options.contentType = 'text/html';
				options.content = listener.loadView(nsReq) || 'niks nie';
				break;
			case 'json':
			default:
				options.contentType = 'application/json';
				options.content = JSON.stringify(nsReq.response.data);	
				break;
		}
		
		nsReq.res.writeHead(options.code, {
			'Content-Length': Buffer.byteLength(options.content),
			'Content-Type': options.contentType
		});

		nsReq.res.write(options.content);
		nsReq.res.end();
		next(null, {});
	} 
	catch (err) {
		debug.sho(err);
		
		next(err, null);
	}
}

function processRequest(req, res, next) {

	try {

		debug.log('received request [url=' + req.path() + ']');

		//nutshell.newRequest(req, res)
		listener.setupRequest(req, res, function(err, nsReq) {
			if (err) {
				debug.log('failed to setup request [' + err + ']');
				//...unsupported protocol (or unauthorized?)
				serveResponse(nsReq, { content: 'BAD_REQUEST' }, function() {
					next(err, null);
				});
			} else {
				if (!nsReq.authorized || nsReq.status !== 'valid') {
					debug.log('request unauthorized or invalid');
					serveResponse(nsReq, { content: 'INVALID_REQUEST' }, function() {
						next(null, req.id());
					});
					
				} else {
					listener.serveRequest(nsReq, function(err, nsReq) {
						if (err) {
							debug.log('a runtime error occurred [' + err + ']');
							//...runtime errors
							
							//ALWAYS SERVE!? (non-serviam)
							/*serveResponse(nsReq, {}, function(err, nsReq) {
								next(null, req.id());
							});*/
							
							next(err, null);
						} else {
							//served request :)
							serveResponse(nsReq, {}, function(err, nsReq) {
								if (err) {
									debug.log('crap [' + err + ']');
								} else {
									next(null, req.id());
								}
							});
						}
					});
				}
			}
		});
	}
	catch (err) {
		// serveResponse(nsReq, { content: 'unexpected error [err=' + err + ']' }, function() {
		// 	next(err, null);
		// });
		res.content = 'unexpected error [err=' + err + ']';
		errorRequest(req, res, next);
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

server.get({ path: '/nutshell/:service/:resource', name: 'nutshellRequest' }, [listener.authIt(), processRequest]);
server.get({ path: /assets\/.*/, name: 'asset' }, restify.serveStatic({ directory: process.cwd() + '/soaif/views' }));
server.get({ path: /guides\/.*/, name: 'guide' }, restify.serveStatic({ directory: process.cwd() + '/soaif/views/' }));
server.get({ path:  /.*/, name: 'lander' }, 
	function(req, res, next) { 
		var roles = 'user';	//lookup from req.session.user or req.user._id;
	    res.header('Location', '/nutshell/soaif/guides.view?type=' + roles);
		res.send(302, 'ur_welcome...');
		next();	
	},
	restify.serveStatic({ directory : process.cwd() + '/soaif/views', fileName: 'welcome.html' })
);

function errorRequest(req, res, cb) {
	var body = '<html><body>' + res.content || 'unknown' + '</body></html>';
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

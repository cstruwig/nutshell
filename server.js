/*
REF:

http://localhost:8080/nutshell/soaif/metrics?model=getCounterNames
http://localhost:8080/nutshell/soaif/metrics
http://localhost:8080/nutshell/orchestrationdemo/infatuation?name=cow&educateme=1

http://localhost:8080/nutshell/websearch/results?query=carnivores

Standardized service interfaces: one of the fundamental requirements is the need for standardized interfaces and specifications. The specifications must include how the service can be used, which data (types) are required and how certain guidelines can be applied.

eg. 


Loose connection: it should be possible to link the services together loosely to form one process. This presupposes a modicum of interdependence between individual services. The principle is to limit the amount of dependency to the level required to still guarantee interoperability (and compatibility).

Functional abstraction: services should prescind outward functional specifics and implementation details in order to enable their loose connection. The only functions to be encapsulated are outward services and specifications.

Reusability: one basic idea is the reusability of services further down the process chain by other parties or even for other applications. This idea must be factored in at the development stage.
http://localhost:8080/nutshell/weather/conditions?name=durban

Service autonomy: a service should be able to function independently. Service autonomy is the term used to describe a service which is self-sufficient in terms of managing all the necessary logic, resources and environment and which is independent of external services.


Statelessness of service: the philosophy behind the performance of services is that a defined service is rendered. This can also involve data retention but only if expressly requested. Other services do not hold any master data and therefore do not have to perform any status management tasks between two service requests.


Findability of service: it must be possible to find a service to be able to use it. This is generally managed via service repositories. A repository is available to all consumers and providers and contains service interface and implementation specifications. It stores all the information required by a consumer in order to request a service.


Capacity of service for orchestration: orchestration is the name given to the process whereby individual services are combined in functional and technical terms to form larger units, the business processes. Since the objective of SOA is to map the technical business process, the capacity for orchestration is a further requirement on SOA services. Services should be able to perform individual tasks effectively in an overall process. One of the central requirements is independence from the complexity and extent of the process in any given case.
	http://localhost:8080/nutshell/entertainment/movies?name=bacon
	http://localhost:8080/nutshell/entertainment/artists?name=bacon
	thus
	http://localhost:8080/nutshell/orchestrationdemo/infatuation?name=toothpicks



TODO...
--------
we spoke about soa and how sunfork delivers this in a practical and simple way.
we spoke of a SOAIF which governs and manages everything in your SOA arsenal.
we mentioned that SOA was hard to define but it's characteristics are not.

so when we look at nutshell...
consider the characteristics of SOA

■ business driven - SOA requires business requests
	"it’s an app store for enterprise integration"
	gaining insight into your services crowdsourcing requirements and faults through a social media platform.
■ vendor-neutral - SOA ensures evolution

■ enterprise-centric - services are reusable and interoperable

■ composition-centric - agile and fast turnaround time



first the typical stuff:


views


service catalogue (self documenting)
diagnostics/testing

security

create compound service

practical example

technology stack
	nodejs
	restify (based on express)
	mongodb & firebase (managed by mongofb)
	statsd (and graphite)
	jquery (currently exploring meteorjs and reactjs)
	grafana (or commercial options include appfirst and geckoboard)

*/

//if (process.env.NODE_ENV !== 'production'){
require('longjohn');
//}

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
			nsReq.response.data.request.params = nsReq.filter;
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
		//ns.metrics.addCounter(req.path());

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

var redirect = function(options) {

	var options = {
		url: options.url || '/nutshell/soaif/guides.view'
	};

	function _redirect(req, res, next) { 
		//debug.log('*** REDIRECTING FROM "' + req.path() + '"');
		var roles = 'user';	//lookup from req.session.user or req.user._id;
	    res.header('Location', options.url + '/?type=' + roles);
		res.send(302, 'welcome to nutshell...');
		return next();
	}

	return (_redirect);
}

server.get({ path: '/favicon.ico', name: 'favicon' }, [middleware('favicon'), restify.serveStatic({ directory: process.cwd() + '/soaif/views/assets/' }) ]);
server.get({ path: /assets\/.*/, name: 'asset' }, [middleware('asset'), restify.serveStatic({ directory: process.cwd() + '/soaif/views' }) ]);
//server.get({ path: /guides\/.*/, name: 'guide' }, [middleware('guide'), restify.serveStatic({ directory: process.cwd() + '/soaif/views' }) ]);
server.get({ path: '/nutshell/:service/:resource', name: 'nutshellRequest' }, [middleware('nsReq'), listener.authIt(), processRequest]);
//server.get({ path: '/adminMe', name: 'nutshellRequestGod' }, [middleware('nsReqGod'), listener.authIt('nsReqGod'), processRequest]);
server.get({ path:  /.*/, name: 'lander' }, 
	function(req, res, next) { 
		debug.log('*** REDIRECT! *** [url=' + req.path() + ']');
		var roles = 'user';	//lookup from req.session.user or req.user._id;
	    res.header('Location', '/nutshell/soaif/guides.view?type=' + roles);
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

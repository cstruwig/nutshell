require('longjohn');

var ns = require('../soaif/nutshelljs/0.0.1/package');
//var lastfm = require('../application/lastfm');

module.exports = {
	getClaims: function(nsReq) {
		//nsReq.logInfo('function started');

		/*lastfm.getArtists('cher', function(data) {
			nsReq.req.log.info('done with last fm');
		});*/

//		var nsRes = ns.listener.newResponse(nsReq);
		//ns.debug.log('hi. inside getClaims');
		//ns.debug.stop(nsReq.id);
		var nsRes = ns.listener.newResponse(nsReq);
		nsRes.data = {
			result: 'got the claim'
		}
		return nsReq.callback(nsRes);
	},
	getPolicies: function(nsReq, cb) {
		//ns.debug.log('yo... inside getPolicies');
		//res.write('xyz/123321');
		//res.header('x', 'sa');
		//ns.debug.log('done()');
		var nsRes = ns.listener.newResponse(nsReq);
		nsRes.data = {
			result: 'got the policy'
		}
		return nsReq.callback(nsRes);
	}
}
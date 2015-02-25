require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tia = require('../applicationservices/m&f/tia');

exports.getClaims = function(nsReq, next) {

	var result = ns.tools.collection('claims');

	//******************* setup filters....
	var claimNo = nsReq.getParameter('claimno', { 
		typeName: 'number', 
		mandatory: true, 
		description: 'claim number to retrieve'
	});

	var deferred = ns.Q.defer();

	//******************* validate filters
	// if (nsReq.helping) {
	// 	return next(nsReq.education);
	// }

	if (!nsReq.validFilter()) {
		//return epty results
		nsReq.response.data = result.data();
		nsReq.response.status = 'invalid';
		deferred.resolve(nsReq);
	} else {
		//******************* process....		
		//setup search filter
		var filter = { ref: claimNo };
		//get the data
		tia.loadClaim(filter, function(err, claims) {
			
			if (err) {
				deferred.reject(err);
			} else {

				//******************* populate response....
				nsReq.response.data = claims.data();
				nsReq.response.status = 'valid';

				deferred.resolve(nsReq);
			}
		});
	}

	return deferred.promise.nodeify(next);
}

exports.getPolicies = function(nsReq, next) {

	var result = ns.tools.collection('policies');

	//******************* setup filters....
	var policyNo = nsReq.getParameter('policyno', { 
		typeName: 'number', 
		mandatory: true, 
		description: 'policy number to retrieve',
	});

	var deferred = ns.Q.defer();

	//******************* validate filters
	// if (nsReq.helping) {
	// 	return next(nsReq.education);
	// }

	if (!nsReq.validFilter()) {
		//return epty results
		nsReq.response.data = result.data();
		nsReq.response.status = 'invalid';
		deferred.resolve(nsReq);
	} else {
		//******************* process....		
		//setup search filter
		var filter = { ref: policyNo };

		//get the data
		tia.loadPolicy(filter, function(err, policies) {
			
			if (err) {
				deferred.reject(err);
			} else {

				//******************* populate response....
				nsReq.response.data = policies.data();
				nsReq.response.status = 'valid';

				deferred.resolve(nsReq);
			}
		});
	}

	return deferred.promise.nodeify(next);
}
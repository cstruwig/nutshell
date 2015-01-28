require('longjohn');

var debug = require('./debug');

function getProvisioning(nsReq, next) {
	next(null, { authorized: true });
}

exports.authorize = function(nsReq, next) {

	getProvisioning(nsReq, function(err, result) {
		if (err) { 
			console.log('auth err');
			next(err, null);
		} else {
			if (result.authorized) {
				nsReq.consumer.consumerId = 22;		//FIX!
				nsReq.consumer.token = nsReq.ref;	//FIX!
				nsReq.authorized = true;
			} else {
				nsReq.consumer.consumerId = 11;		//?
				nsReq.consumer.token = '';
				nsReq.authorized = false;
				nsReq.addMessage('unauthorised request');
			};
			
			next(null, nsReq);
		}
	});
}


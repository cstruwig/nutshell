var debug = require('./debug');
var fs = require('./filesystem');

//nutshell: rules
//all services have at least ONE try catch : catch(err) { service.err(service, err); }
//check that a service has ONE point of exit : ns.exit(next);	//will check for error
//a service MUST have a search flag : ns.request(req, next) {}
//must have at least one filter? //NO!!!! can have none eg. callForHelp('prettyplease');
//every service has a test consumer with UI

exports.parse = function(value, next) {
	next(err, nsReq);
}

module.exports = function(nsReq, next) {
	
//	var err = ns.err()
	var result = ns.data();
	
	try {
		//filters
		
		//process
		
		//create response
		nsResponse
		
	}
	catch (err) {
		ns.err(err);		
	}
	
	next(err, result);
}


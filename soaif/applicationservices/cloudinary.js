require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;

var cloudinary = require('cloudinary');

cloudinary.config({ 
	cloud_name: 'sunfork', 
	api_key: '939775662437417', 
	api_secret: 'fkIbDRKiU0K5nEmFIMRIXPjmgBw' 
});

exports.addDocument = function(req, next) {

	var req = {
		source = req.source;
	}

	cloudinary.uploader.upload(
		req.source, 
		function(result) { 
	  		if (result.err) next(result.err);
			return next(null, result);
		},
		{
		    public_id: 'sample_id', 
		    crop: 'limit',
		    width: 2000,
		    height: 2000,
		    eager: [
		      { width: 200, height: 200, crop: 'thumb', gravity: 'face',
		        radius: 20, effect: 'sepia' },
		      { width: 100, height: 150, crop: 'fit', format: 'png' }
		    ],                                     
		    tags: ['special', 'for_homepage']
	  	});

	// if (!filter.name || filter.name === '') {
	// 	next(new Error('invalid or empty name specified'));
	// }
};
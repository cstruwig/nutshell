require('longjohn');

var fs = require('fs');

exports.fileExists = function(path) {
	var result = false;
	try
	{
		result = fs.existsSync(path);
	}
	catch (err)
	{ /* FRESCA */ }

	return result;
};

exports.readFile = function(path) {
	var result = false;
	try
	{
		result = fs.readFileSync(path);
	}
	catch (err)
	{ /* FRESCA */ }

	return result;
};

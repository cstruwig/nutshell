var bunyan = require('bunyan');

var _dbg = '';

var logger = bunyan.createLogger({
    name: 'nutshell',
//    src: true,
    streams: [
        {
            level: 'info',
            stream: process.stdout            // log INFO and above to stdout
        },
        {
            level: 'error',
            path: __dirname + '/../logs/error.log'
        },
        {
            level: 'trace',
            path: __dirname + '/../logs/trace.log'
        }
    ]
});

//http://stackoverflow.com/questions/14172455/get-name-and-line-of-calling-function-in-node-js
//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
Object.defineProperty(global, '$nsstack', {
    get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '$nsm', {
    get: function() {
        return require('path').basename($nsstack[3].getFileName());
    }
});

Object.defineProperty(global, '$nsf0', {
    get: function() {
    	var fName = $nsstack[1].getFunctionName();
        return (typeof fName === 'undefined' || !fName ? '<anonymous>' : fName).replace('module.exports.', '').replace('exports.', '') + '()';
    }
});

Object.defineProperty(global, '$nsf1', {
    get: function() {
    	var fName = $nsstack[2].getFunctionName();
        return (typeof fName === 'undefined' || !fName ? '<anonymous>' : fName).replace('module.exports.', '').replace('exports.', '') + '()';
    }
});

Object.defineProperty(global, '$nsf2', {
    get: function() {
    	var fName = $nsstack[3].getFunctionName();
        return (typeof fName === 'undefined' || !fName ? '<anonymous>' : fName).replace('module.exports.', '').replace('exports.', '') + '()';
    }
});

Object.defineProperty(global, '$nsl', {
    get: function() {
        return $nsstack[3].getLineNumber();
    }
});

Object.defineProperty(global, '$nsloc', {
    get: function() {
        return '[' + $nsm + ' -> ' + $nsf2 + '::' + $nsl + ']';
    }
});

exports.log = function(message) {
	console.log(message + ' [' + _dbg + ']');
    logger.trace($nsloc + ' ' + message + ' [' + _dbg + ']');
    _dbg = '';
}

exports.lo = function(key, val) {
	if (typeof val !== 'undefined' && val) { 
		_dbg += ', ' + key + '=' + val;
	} else {
		_dbg += ', *|' + key + '|*';
	}
}

exports.sho = function(obj) {
    console.log(' ============================ ------.');
    console.log(require('util').inspect(obj, { showHidden: true, depth: null }));
    console.log(' ============================ ------^');
}
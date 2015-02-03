/*
SOA framework - http://geddyjs.org/ also look for "GO"???
read this question - http://stackoverflow.com/questions/16433992/node-js-soa-with-json-web-services-configuration

TUT: create a module - http://quickleft.com/blog/creating-and-publishing-a-node-js-module
restify - 	https://gentlenode.com/journal/node-3-restify-cheatsheet/44
			http://mcavage.me/node-restify/
logging - 	http://blog.nodejs.org/2012/03/28/service-logging-in-json-with-bunyan/
XML2JSON - 	https://thomashunter.name/blog/node-js-convert-json-to-xml-and-pluralize/
jade - 		http://jade-lang.com/tutorial/


installation - https://github.com/npm/npm/issues/5584 AND sudo curl -L http://npmjs.org/install.sh | sh
*/
// require('nodetime').profile({
// 	accountKey: '1f0bd093758a6888dfeb017b0ff5cc10de3b7bd8', 
// 	appName: 'Node.js Application'
// });

module.exports = {
	get promise() {
		return (require('promise'));
	},
	get util() {
		return (require('util'));
	},
	get tools() {
		return (require('./tools'));
	},
	get request() {
		return (require('request'));
	},
	get inflection() {
		return (require('inflection'));
	},
	get debug() {
		return (require('./debug'));
	},
	get filesystem() {
		return (require('./filesystem'));
	},
	get listener() {
		return (require('./listener'));
	},
	setting: function(setting) {
		return require('../../settings.json').production[setting];
	}
}

Object.prototype.makeArray = function() {
	var result = [];

	if (require('util').isArray(this)) {
		result = this;
	} else {
		result.push(this);	
	}
	
	return result;
}

Object.prototype.count = function() {
    var result = 0;
    for(property in this) {
        if(this.hasOwnProperty(property)) {
            result++;
        }
    }
    return result;
};

Object.prototype.isArray = function() {
	return require('util').isArray(this);
}

Object.prototype.hasValue = function() {
    var result = false;
 	if (typeof this !== 'undefined') {
		result = this.count() > 0;
	}
    return result;
};

String.prototype.hasValue = function() {
    var result = false;
	if (typeof this !== 'undefined') {
		result = this.trim() !== '';
	}
	return result;
};

Array.prototype.distinctValues = function() {
   var u = {}
   var result = [];
   
   for(var i=0; i<this.length; ++i) {
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      result.push(this[i]);
      u[this[i]] = 1;
   }
   return result;
}

Array.prototype.contains = function(obj) {
	return (this.indexOf(obj) > -1);
}

if (!String.prototype.includes) {
  String.prototype.includes = function() {'use strict';
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}

if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(searchString, position) {
      position = position || 0;
      return this.lastIndexOf(searchString, position) === position;
    }
  });
}

if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, 'endsWith', {
    value: function(searchString, position) {
      var subjectString = this.toString();
      if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }
  });
}
/*
Number.prototype.hasValue = function() {
    var that = this;
    var result = false;
    
 	result = typeof that !== 'undefined';
	
    return result;
};

Boolean.prototype.hasValue = function() {
    var that = this;
    var result = false;
    
 	result = typeof that !== 'undefined';
	
    return result;
};
*/
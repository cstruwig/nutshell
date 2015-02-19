/*
Q promises: http://strongloop.com/strongblog/promises-in-node-js-with-q-an-alternative-to-callbacks/

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
	get Q() {
		return (require('q'));
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
  get db() {
    return (require('./db'));
  },
	setting: function(setting) {
		return require('../../settings.json').production[setting];
	},
  get metrics() {
    return require('./metrics');  
  }
}

if (!Object.prototype.makeArray) {
  Object.defineProperty(Object.prototype, 'makeArray', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      var result = [];

      if (require('util').isArray(this)) {
        result = this;
      } else {
        result.push(this);  
      }
      return result;
    }
  });
}

if (!Object.prototype.count) {
  Object.defineProperty(Object.prototype, 'count', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      var result = 0;
      for(property in this) {
        if(this.hasOwnProperty(property)) {
          result++;
        }
      }
      return result; 
    }
  });
}

if (!Object.prototype.isArray) {
  Object.defineProperty(Object.prototype, 'isArray', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      return require('util').isArray(this);
    }
  });
}

if (!Object.prototype.hasValue) {
  Object.defineProperty(Object.prototype, 'hasValue', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      var result = false;
      if (typeof this !== 'undefined') {
       result = this.count() > 0;
      }
      return result;
    }
  });
}

if (!String.prototype.hasValue) {
  Object.defineProperty(String.prototype, 'hasValue', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      var result = false;
      if (typeof this !== 'undefined') {
        result = this.trim() !== '';
      }
      return result;
    }
  });
}

if (!Array.prototype.distinctValues) {
  Object.defineProperty(Array.prototype, 'distinctValues', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
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
  });
}

// if (![].includes) {
//   Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {'use strict';
//     var O = Object(this);
//     var len = parseInt(O.length) || 0;
//     if (len === 0) {
//       return false;
//     }
//     var n = parseInt(arguments[1]) || 0;
//     var k;
//     if (n >= 0) {
//       k = n;
//     } else {
//       k = len + n;
//       if (k < 0) {k = 0;}
//     }
//     var currentElement;
//     while (k < len) {
//       currentElement = O[k];
//       if (searchElement === currentElement ||
//          (searchElement !== searchElement && currentElement !== currentElement)) {
//         return true;
//       }
//       k++;
//     }
//     return false;
//   };
// }

if (!Array.prototype.contains) {
  Object.defineProperty(Array.prototype, 'contains', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(value) {
      return (this.indexOf(value) > -1);
    }
  });
}

if (!String.prototype.includes) {
  String.prototype.includes = function() {
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
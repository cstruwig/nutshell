function updateQuerystring(key, value) {
     
 	var pathname = window.location.pathname;
 	var params = toParams(window.location.search);
 	params[key] = value;

	window.location.href = pathname + '?' + jQuery.param(params);
}

function parsePath(nsData) {
  var path = nsData.request.path.split('/');
  return {
    service: path[0],
    resource: path[1],
    singularResource: path[2]
  }
}

function toParams(searchUrl) {
  var result = {}
  if(searchUrl == '')
    return result;

  var queryString = searchUrl.substr(1);

  var params = queryString.split("&");

  jQuery.each(params, function(index, param){
    var keyPair = param.split("=");

    var key = keyPair[0];
    var value = keyPair[1];

    if(result[key] == undefined)
      result[key] = value
    else{

      if(result[key] instanceof Array) //current var is an array just push another to it
        result[key].push(value)
      else{ //duplicate var, then it must store as an array
        result[key] = [result[key]]
        result[key].push(value)
      }
    }
  })

  return result;
}

$.fn.styleSubtext = function(opts) {
  //http://stackoverflow.com/questions/9794851/find-text-string-in-jquery-and-make-it-bold
  var tag = opts.tag || 'span'
    , subtext = opts.subtext || []
    , regex = RegExp(subtext.join('|'), 'gi') // case insensitive
    , style = opts.style || 'color:red'
    , replacement = '<'+ tag +' style="' + style + '">$&</'+ tag +'>';

  return this.html(function() {
    return $(this).text().replace(regex, replacement);
  });
};

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
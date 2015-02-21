function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function parsePath(nsData) {
  var path = nsData.request.path.split('/');
  return {
    service: path[0],
    resource: path[1],
    singularResource: path[2]
  }
}

function nutshell(options, next) {

  var options = {
    table: options.table || false,
    navbar: options.navbar || true
  }  

  if (options.table) {
    //FIX!
  }

  $('#nsmodal').modal({ show: false });

  function _nutshell(next) {

    if (options.navbar) {
      console.log('we must draw navbar');

      //add the navbar
      $('body').append($('<div id="nsNav"></div>'));

      //load up the html
      setupNavbar({}, function() {
        console.log('we are good to go!');
        //navbar ready!!!!
        return next();
      });


    } else {
      return next();
    }
  }

  return (_nutshell(next));
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

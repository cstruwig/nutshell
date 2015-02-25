(function() {

  this.ns = function(selector) {

    var result = $(selector);

    if (result) {
      if (result.length == 1) {
        //parent
        return result;
      }

      var parent = result.closest('.' + nsData.request.ref);
      if (parent.length === 1) {
        return result;
      } else {
//        debugger;
      }

    } else {
      console.log('couldnt find it yo!', selector);
      return undefined;
    }
  }
  this.nsView = function() {
    
    var vid = nsData.request.ref || -1;
    var nsView = {};

    nsView = $('#nsView');

    if (nsView && nsView.length > 0) {
      if (nsView.length === 0 || nsView.length > 1) {
        //debugger;
      } else {
        if (nsView.hasClass('nsView')) {
          return nsView;
        }

        nsView.addClass('nsView');
        nsView.addClass(vid);
      }
    }

    return nsView;
  }

  this.nsPathInfo = function() {

    var result = { 
      path: nsData.request.path,
      service: '',
      resource: '',
      singularResource: ''
    };

    try
    {
      var pathParts = result.path.split('/');
      result.service = pathParts[0];
      result.resource = pathParts[1];
      result.singularResource = pathParts[2];
    }
    catch (err) {
      console.log('failed to parse path', path, err);
    }

    return result;
  }
  this.nsRedirect = function(options) {
    var options = {
      url: options.url || 'http://www.sunfork.com'
    }
    window.location = options.url;
  }

  this.nsModal = function(options) {

    var options = {
      message: options.message || 'hi...',
      messageHtml: options.messageHtml || '<p>' + options.message + '</p>',
      title: options.title || 'title',
      titleHtml: options.titleHtml || 'title',
      buttons: options.buttons || 'default',
      size: options.size || 'normal'
    }


    var $nsModal = $('#nsModal');
    $nsModal.find('.modal-dialog').removeClass('modal-lg').removeClass('modal-sm');   //HACK!

    switch (options.size) {
      case 'small':
        $nsModal.find('.modal-dialog').addClass('modal-sm');
        break;
      case 'large':
      default:
        $nsModal.find('.modal-dialog').addClass('modal-lg');
        break;
    }
    
    $('#nsModalTitle').html(options.titleHtml);

    if (options.buttons === 'default') {
        options.buttons = $('<button type="button" class="btn btn-default" data-dismiss="modal">cancel</button>');
    }

    $nsModal.find('.modal-body').empty().append($(options.messageHtml));
    $nsModal.find('.modal-footer').empty().append(options.buttons);

    return $nsModal.modal('show');
  }

}());

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}



var nsHTML = {
  //http://jsfiddle.net/unLSJ/
  replacer: function(match, pIndent, pKey, pVal, pEnd) {
    var key = '<span class=json-key>';
    var val = '<span class=json-value>';
    var str = '<span class=json-string>';
    var r = pIndent || '';
    
    if (pKey)
      r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
    if (pVal) {
      r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';

      // if (pVal.startsWith('"http')) {
      //   console.log(pVal);
      //   pVal = '<a href="' + pVal + '">' + pVal + '</a>';
      // }
      
    }

    return r + (pEnd || '');
  },
  printJSON: function(obj) {
    var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
    return JSON.stringify(obj, null, 3)
      .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(jsonLine, nsHTML.replacer);
  }
};

function nutshell(options, next) {
  
  var options = {
    table: options.table || false,
    navbar: options.navbar || false
  } 

  //$('#nsmodal').modal({ show: false });

  function _nutshell(next) {

    //nsView();
    var nsView = this.nsView();

    if (options.navbar) {

      console.log('we must draw navbar');

      //load up the html
      setupNavbar({ fixedTop: true }, function() {
        console.log('finished setting up navbar');
        nsView.css('margin-top', '60px');
        return next();
      });
    } else {
      console.log('this view is not adding a searchbar!');
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

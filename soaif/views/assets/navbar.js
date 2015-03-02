var suggestions;
var searchBar;
var searchBarVal;
var User;
var userOptions = { resources: [] };
var suggestedOptions = [];

function setPath(path) {
  var url = nsData.request.url + '/nutshell/' + path + '.view?educateme=1';
  window.location = url;
}

$.fn.styleSubtext = function(opts) {
  //http://stackoverflow.com/questions/9794851/find-text-string-in-jquery-and-make-it-bold
  var tag = opts.tag || 'span'
    , subtext = opts.subtext || []
    , regex = RegExp(subtext.join('|'), 'i') // case insensitive
    , style = opts.style || 'color:red'
    , replacement = '<'+ tag +' style="' + style + '">$&</'+ tag +'>';

  return this.html(function() {
    return $(this).text().replace(regex, replacement);
  });
};

function parsePath() {
  var pathBits = nsData.request.path.split('/');
  return pathBits[0] + ' > ' + pathBits[1];
}     

//http://stackoverflow.com/questions/20073618/using-bootstrap-3-0-modals-to-load-dynamic-remote-content-within-an-ifram
function parseSearchText() {
  var path = nsData.request.url;
  return path + '/nutshell/' + searchBar.val().replace(' > ', '/');
}

function isValidRequest() {
  var result = false;

  //FIX! check if nsData.roles exist!
  //if (searchBar.val() is valid) {
    result = true;
  //}
  return result;
}


function canAutoComplete() {
  var result = false;
  if (suggestedOptions.length === 1) {
    result = true;
  }
  return result;
}

function uniqueServices() {
  var result = false;
  var uniqueServices = [];
  searchBarVal = searchBar.val();

  suggestedOptions.forEach(function(item) {
    console.log(item);
    var service = item.split(' > ')[0];
    if (!uniqueServices.contains(service)) {
      uniqueServices.push(service);
    }
  });   

  return uniqueServices;
}

function calculateSuggestions() {
  suggestedOptions = [];

  //identify matches/filter suggestions
  userOptions.resources.forEach(function(item, ctr) {   //this comes from fb...

    //check user's' CRUD priviliges
    if (!item.ops.includes('c') && !item.ops.includes('r') && !item.ops.includes('u') && !item.ops.includes('d') ) {
      console.log('no suggestions, no roles configured :( check the logged on user record on FB...');
    } else {
      var optionText = item.path.replace('/', ' > ');
      if (optionText.includes(searchBar.val())) {
        suggestedOptions.push(optionText);
      }
    }
  });

  console.log('suggestedOptions.length=', suggestedOptions.length);
}

function showSuggestions(hide) {
  
  if (typeof hide === 'boolean') {
    if (!hide) {
      suggestions.hide();
      return;  
    }
  }

  //RENAME TO REPAINT SUGGESTIONS PLEASE!!!
  var suggestionHint = (suggestedOptions.length === 0) ? 'no suggestions' : 'suggestions';
  var suggestionMarkup = '<li class="dropdown-header">' + suggestionHint + '</li>';
  searchBarVal = searchBar.val();

  //matches are populated/filtered when fb sends notification
  suggestedOptions.forEach(function(item, ctr) {
    var matchingService = item.split(' > ')[0];
    var matchingResource = item.split(' > ')[1];

    suggestionMarkup += '<li><a href="#" class="suggestion" style="color: #c0c0c0";>' + matchingService + ' > ' + matchingResource + '</a></li>';
  });

  //add other commands/options
  suggestionMarkup += '<li class="divider"></li><li><a href="#"><strong>help me</strong></a></li>';

  //format the suggestion text
  suggestions.html($(suggestionMarkup)).find('li>a').styleSubtext({
    subtext: [searchBarVal],
    style: 'font-weight: bold; color: #000'
  });

  suggestions.show();
  
  // //WHY look at userOptions?
  // if (searchBarVal === '' || !userOptions || !userOptions.resources) {
  //   console.log('problem');
  //   toggleSuggestions();
  //   return;
  // }
}

function initUI() {
  suggestions = $('#suggestions');
  searchBar = $('#searchBar');

  searchBarVal = nsPathInfo().service + ' > ' + nsPathInfo().resource;
  searchBar.val(searchBarVal);
  //searchBar.attr('placeholder', request.service + ' > ' + request.resource);
  searchBar.attr('placeholder', 'service > resource');
  //searchBar.focus();
}

function initEvents() {

  //*************************************** FB ****************************************************
  //setup fb
  User = new Firebase('https://nutshell.firebaseio.com/user/' + nsData.request.user.ref);
  User.on('value', function(data) {

    //setup roles //FIX! dont think we use this...
    userOptions = data.val() ? data.val().roles : [];

    if (!userOptions.resources || userOptions.resources.length === 0) {
      //no roles configured
      console.log('no suggestions, no roles configured :( check the logged on user record on FB...');
      userOptions.resources = [];
    }

    searchBarVal = searchBar.val();
    if (
        searchBarVal !== (nsPathInfo().service + ' > ' + nsPathInfo().resource)
      ) {
      console.log(searchBarVal);
      console.log(nsPathInfo().service + ' > ' + nsPathInfo().resource);
      console.log('bug!!!');
      calculateSuggestions();
      showSuggestions();  
    }
  });
  //*************************************** FB ****************************************************

  //*************************************** searchbar ****************************************************
  searchBar.parent().on('keydown', '#searchBar', function(evt) {
    //check for special keys for autocompletion and submission
    var key = evt.keyCode || evt.which;
    var searchBarVal_original = nsPathInfo().service + ' > ' + nsPathInfo().resource;
    searchBarVal = searchBar.val();

    if (key === 8 || key === 64) {  //backspace delete
      if (searchBarVal.endsWith(' ') || searchBarVal.trim().endsWith(' >') ) {
        var pos = searchBarVal.indexOf(' >');   //at keup stage the delete was already affective hence the ' >'
        if (pos > 0) {
          searchBar.val(searchBarVal.substring(0, pos+1));
        }
      }
    } else if (key === 27) {           //ESCAPE
      showSuggestions(false);
      searchBar.val(searchBarVal_original);
    } else if (key === 32 || key === 9 || key === 10 || key === 13) {     //SPACE & TAB & ENTER=autocomplete (AND submit)
      evt.preventDefault();
    }
  });

  //searchBar.keyup() ==================== after keypress
  searchBar.keyup(function(evt) {
    var key = evt.keyCode || evt.which;

    //FIX! if someone types the > or . then make it " > " use key === 46 || key === 62!
    if (key === 27) {
      //showSuggestions(false);
      return;
    }

    if (key === 9 || key === 10 || key === 13 || key === 32) {      
      if (suggestedOptions.length === 1) {    //only one option so autocomplete
        //auto complete
        showSuggestions(false);
        searchBar.val(suggestedOptions[0]);

        if (key === 13) {
          searchBarVal = searchBar.val();
          if (searchBarVal !== (nsPathInfo().service + ' > ' + nsPathInfo().resource)) {

            var url = nsData.request.url + '/nutshell/' + searchBar.val().replace(' > ', '/') + '?view=default';
            nsRedirect({ url: url });
          }
        }

        evt.preventDefault();
        return;
      } else {
        var services = uniqueServices();
        if (services.length === 1) {
          searchBar.val(services[0] + ' > ');
        }
      } //if (suggestedOptions.length === 1)    
    }

    calculateSuggestions();
    showSuggestions();
  });      

  searchBar.click(function() {
    calculateSuggestions();
    searchBarVal = searchBar.val();
    console.log(searchBarVal !== (nsPathInfo().service + ' > ' + nsPathInfo().resource));
    console.log(suggestedOptions.length > 1);
    if (searchBarVal !== (nsPathInfo().service + ' > ' + nsPathInfo().resource) && suggestedOptions.length > 1) {
      console.log('showing the suggestions');
      showSuggestions();  
    }
  });

  // searchBar.blur(function() {
  //   showSuggestions(false);
  // });

  $('.nsmenu > li > a').click(function() {
    var $this = $(this);

    if ($this.hasClass('myViews')) {
      var viewsHtml = '';
      var url = 'http://localhost:8080/nutshell/soaif/links?account=' + nsData.request.user.account;
      $.get(url, function(data) {
        data.links.link.forEach(function(item) {
          viewsHtml += '<a href="' + item.url + '" class="btn btn-xs btn-block btn-default" type="button">' + item.description + '</a><br>';
        });

        nsModal({
          titleHtml: '<span>my <strong>nut</strong>shell views</span>',
          messageHtml: viewsHtml,
          buttons: [
            $('<button type="button" class="btn btn-default" data-dismiss="modal">cancel</button>')
          ]
        });
      });
      
      
    }
  });

  //*************************************** searchbar ****************************************************
}

function setupNavbar(options, next) {
  //options.fixedTop

  //does it exist yet?
  if ($('#nsNav').length === 0) {

    //add the navbar
    $('body').append('<div id="nsNav"></div>');

    //load up the html
    $('#nsNav').load('../../assets/navbar.html', function() {
      initUI();
      initEvents();
    });

    return next();

  } else {

    return next();
  }
}
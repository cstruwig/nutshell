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
Meteor.methods({
	'getData': function(path, filter) {
		console.log('fecthing ' + path);
		var data = Meteor.http.call('GET', 'http://localhost:8080/nutshell/' + path + '?' + filter);
		if (data) {
			console.log('received... ' + data + ' [path=' + path + ']');
			result = JSON.parse(data.content);
		}
		return result;
	}

	
});

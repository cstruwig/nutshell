require('longjohn');

var inflection = require('inflection');

exports.makeArray = function(obj) {
	if (!obj.isArray()) {
		var result = [];
		result.push(obj);
		obj = result;
	}
	return obj;
}

exports.guid = function(val) {
	var guid = require('guid').create();
	if (!guid) {
		return new Guid(val);
	}
	return guid;
};

exports.collection = function(name) {

	var plural = inflection.pluralize(name);
	var singular = inflection.singularize(name);
	var index = -1;
	
	var result = {
		add: function(obj) {
			//FIX! support adding multiples...
			if (false) { //obj.isArray()) {
				obj.forEach(function(item) {
					this[plural][singular].push(item);
				});
			} else {
				this[plural][singular].push(obj);			
			}
		},
		get length() {
			return this[plural][singular].length;
		},
		//each2: this[plural][singular].forEach,
		each: function(next) {
			while (index < this.length-1) {
				index++;
				item = this[plural][singular][index];
				next(index, item);
			}
		},
		data: function() {
			var data = {};
			data[plural] = result[plural];
			return data;
		}
	};
	
	result[plural] = {};
	result[plural][singular] = [];
	
	return result;
}
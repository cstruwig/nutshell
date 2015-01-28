require('longjohn');

var ns = require('../soaif/lib');

exports.sendMail = function(filter, next) {

	var sendgrid = require('sendgrid')(api_user, api_key);
	var email = new sendgrid.Email();

	email.addTo("test@sendgrid.com");
	email.setFrom("you@youremail.com");
	email.setSubject("Sending with SendGrid is Fun");
	email.setHtml("and easy to do anywhere, even with Node.js");

	sendgrid.send(email);
};
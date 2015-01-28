//http://www.amqp.org/
//https://www.cloudamqp.com/docs/nodejs.html

var amqp = require('amqp'); 

exports.init = function(queueName, pub, sub) {

	// Get the URL from ENV or default to localhost
	var url = process.env.CLOUDAMQP_URL || "amqp://localhost";

	// Open a connection
	var conn = amqp.createConnection({ url: url }, {
		reconnect: true, // Enable reconnection
		reconnectBackoffStrategy: 'linear',
		reconnectBackoffTime: 1000, // Try reconnect once a second
	}); 

	// When connected..
	conn.on('ready', function () {
		// declare the default exchange
		var exchange = conn.exchange('');

		// create a queue
		conn.queue(queueName, { durable: true }, function(queue) { 
			// subscribe to that queue
			queue.subscribe(function(msg) {
				console.log(msg.body);
			});

			// publish a message
			exchange.publish(queue.name, { body: 'Hello CloudAMQP!' }); 
		});
	});
}
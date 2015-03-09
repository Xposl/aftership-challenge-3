var Beanworker = require('fivebeans').worker;

//FIXME: move to config file
var default_options = {
	server: 'challenge.aftership.net',

	//the port of this server
	port: 11300,

	//the tubes list in this worker
	tubes: ['xposl'],
	success: {
		
		//how may time will try if the request success
		time: 10,

		//when will the next request start if success this time
		delay: 60
	},
	failed: {
		
		//how may time will try if the request failed
		time: 3,

		//when will the next request start if failed this time
		delay: 3
	}
};


module.exports = {
	start: function(options) {
		//TODO: set valid options
		options = {
			id: 'aftership_challenge_3',
			host: default_options.server,
			port: default_options.port,
			handlers: {
				currency_rate: require('./handler/currency_rate.handler')()
			},
			ignoreDefault: true
		};
		
		console.log(options);
		var worker = new Beanworker(options);
		worker.start(default_options.tubes);
	}
};

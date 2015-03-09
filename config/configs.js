/**
 * The config file for this worker
 */

module.exports = {
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

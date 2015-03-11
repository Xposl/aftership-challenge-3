/**
 * The config file for this worker
 */

module.exports = {
	beanTalk: {
		host: 'challenge.aftership.net',

		//the port of this server
		port: 11300,

		//the tubes list in this worker
		tubes: ['xposl']

	},

	handlers: {
		currency_rate:	{
			mongodb: {
				url: 'mongodb://aftership:123123@ds029960.mongolab.com:29960/aftership_challenge',
				collection: 'currency'
			},
			success: {
				//how may time will try if the request success
				time: 10,

				//when will the next request start if success this time
				delay: 10
			},
			failed: {
				//how may time will try if the request failed
				time: 3,
				//when will the next request start if failed this time
				delay: 3
			}
		}
	}
};

var fivebeans = require('fivebeans');
var currency = require('../currency');

var client = new fivebeans.client('challenge.aftership.net', 11300);
client
    .on('connect', function()
    {
		client.use("xposl", function(err, tubename) {
			currency.getRate({
				from: 'USD',
				to: 'EUR',
				success: function(res) {
					console.log(res);
				},
				error: function(res) {
					console.log(res);
				}
			});
		});
    })
    .on('error', function(err)
    {
        console.log("connection failure");
    })
    .on('close', function()
    {
        console.log("underlying connection has closed");
    })
    .connect();

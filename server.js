var fivebeans = require('fivebeans');
var currency = require('./currency');

var client = new fivebeans.client('challenge.aftership.net', 11300);
client
    .on('connect', function()
    {
		client.use("xposl", function(err, tubename) {
			console.log(currency);
			//TODO:
		});
		console.log("client can now be used");
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

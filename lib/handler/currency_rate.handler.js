module.exports = function()
{
    function CurrencyRateHandler()
    {
        this.type = 'currency_rate';
    }

    CurrencyRateHandler.prototype.work = function(payload, callback)
    {
		console.log("job!!");
		console.log(playload);
        /*var keys = Object.keys(payload);
        for (var i = 0; i < keys.length; i++)
            console.log(keys[i]);*/
        callback('success');
    }

    var handler = new CurrencyRateHandler();
    return handler;
};

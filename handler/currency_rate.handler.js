var currency = require('../lib/currency.js'),
	mogoClient = reuqire('../lib/mongodb_client')
;


module.exports = function(configs){
	var options = {
		mongodb: {
			url: '',
			collection: ''
		},
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

    function CurrencyRateHandler(configs)
    {
		mongoClient(configs);
        this.type = 'currency_rate';
    };
	
	CurrencyRateHandler.prototype.setOptions = function (configs) {
		//set mongodb
	};
	
	var getCurrencyRate = function(data,callback){
		var error = 0;
		console.log("get result of ",data);
		if(!data.from || !data.to){
			error = 1;
			callback(error);
		}else{
			data.success = function(result){
				callback(result.error,result);
			};

			data.error = function(result){
				callback(result.error,result);
			};
			currency.getRate(data);
		}
	};
	

	var getCurrencyRateFromPayload = function (payload , callback) {
		var _this = this,
			results = [],

			//how many request had get result
			request_t = 0,
			request_error = 0
		;
		console.log("start request");
		//send request to get every currency job from payoad
		for(var i = 0 ; i < payload.length; i++){
			var data =  payload[i];
			getCurrencyRate(data , function(error,result) {
				++request_t;
				results.push(result);
				
				//FIXME:if there is one job failed, The request means failed?
				if(error !== 0) {
					request_error = 1;
				}

				//after every request get the result, callback function
				if(request_t >= payload.length) {
					callback(request_error , results);
				}
			});
		}
	};

    CurrencyRateHandler.prototype.work = function(payload, callback)
    {
		var _this = this,
			success_time = 0,
			failed_time = 0,
			interval = null
		;
		getCurrencyRateFromPayload(payload,function(error, results){
			console.log(results);
			callback("success");
		});
	};

	
    var handler = new CurrencyRateHandler(options);
    return handler;
};

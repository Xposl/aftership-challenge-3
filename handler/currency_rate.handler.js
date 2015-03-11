var currency = require('../lib/currency.js'),
	mongoClient = require('../lib/mongodb_client')
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
	},
	mongo_client
	;

    function CurrencyRateHandler(configs)
    {
		this.setOptions(configs);
        this.type = 'currency_rate';
    };
	
	CurrencyRateHandler.prototype.setOptions = function (configs) {
		if(typeof configs !== 'object')	{
			return;
		}
		
		//set mongodb settings	
		if(typeof configs.mongodb === 'object') {
			for(var key in configs.mongodb) {
				options.mongodb[key] = configs.mongodb[key];
			}
		}
		mongo_client = mongoClient(options.mongodb);

		//set other options
		if(typeof configs.success === 'object') {
			for(var key in configs.success) {
				options.success[key] = configs.success[key];
			}
		}

		if(typeof configs.failed === 'object') {
			for(var key in configs.failed) {
				options.failed[key] = configs.failed[key];
			}
		}
	};
	
	//get result by data like {from: 'HKD', to: 'USD'}
	var getCurrencyRate = function(data,callback){
		var error = 0;

		//TODO: output it to log system
		console.log("get result of ",data);
		if(!data.from || !data.to){
			error = 1;
			callback(error);
		}else{
			data.success = function(result) {
				delete result.amount;
				
				//TODO: output it to log system	
				console.log("the result is ",result);
				callback(result.error,result);
			};

			data.error = function(result) {
			
				//TODO: output it to log system
				console.log("failed!");
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
		
		//send request to get every currency job from payoad
		for(var i = 0 ; i < payload.length; i++){
			var data =  {
				from: payload[i].from,
				to: payload[i].to
			};
			getCurrencyRate(data , function(error,result) {
				++request_t;
				results.push(result);
				
				//FIXME:if there is only one job failed in a multi request, The request means failed?
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
	
	/**
	 * The progress to get currrency rate
     **/
	CurrencyRateHandler.prototype.getCurrencyRateProgress = function(payload,success_time,failed_time) {
		var _this = this;
		getCurrencyRateFromPayload(payload,function(error, results){
			
			//check if this request failed
			if(error) {
				failed_time++;
				
				//TODO: output it to log system
				console.log("Request Failed "+failed_time);
				var delay = options.failed.delay * 1000;

				//FIXME: if the failed result sould be store in database, or to log?
			}else {
				failed_time = 0;
				success_time++;
				
				//TODO: output it to log system
				console.log("Request Success "+success_time);
				var delay = options.success.delay * 1000;

				//Data save to your database
				for(var i = 0; i < results.length; i++) {
					mongo_client.save(options.mongodb.collection,results[i]);
				}
			}
			if(failed_time < options.failed.time
			&& success_time < options.success.time) {
				setTimeout(function() {
					_this.getCurrencyRateProgress(payload,success_time,failed_time);
				},delay);
			}else{
				
				//TODO: output it to log system
				console.log("Job done!!");
			}
		});
	};

    CurrencyRateHandler.prototype.work = function(payload, callback)
    {
		var _this = this;
		
		//TODO: output it to log system
		console.log("new request");
		_this.getCurrencyRateProgress(payload,0,0);
		callback("success");
	};

	
    var handler = new CurrencyRateHandler(configs);
    return handler;
};

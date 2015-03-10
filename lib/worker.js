var Beanworker = require('fivebeans').worker,
	fs = require('fs')
;

module.exports = (function(){
	var options = {
		id: 'aftership_challenge_3',
		host: 'localhost',

		//the port of this server
		port: 11300,

		//the tubes list in this worker
		tubes: [],
		handlers: {},
		ignoreDefault : true
	};

	function Worker() {
		//do something if need;
	};

	Worker.prototype.setOptions = function(input_options){
		if(!input_options
		|| typeof input_options !== 'object'){
			return;
		}

		for(var key in options) {
			if(input_options
			&& input_options.beanTalk 
			&& input_options.beanTalk[key] !== undefined) {
				options[key] = input_options.beanTalk[key];
			}
		}
		if(typeof input_options.handlers === 'object') {
			for(var handler in input_options.handlers){
				var handler_args = input_options.handlers[handler],
					handler_path = '../handler/'+handler+'.handler';
				if(fs.existsSync('./lib/'+handler_path+'.js')) {
					options.handlers[handler] = require(handler_path)(handler_args);
				}else{
					console.log('Handler Not Found : '+handler);
				}
			}
		}
	};
	
	
	
	Worker.prototype.start = function(input_options) {
		var _this = this;
		_this.setOptions(input_options);	
				
		console.log("worker init");	
		var worker = new Beanworker(options);
		worker.start(options.tubes);
		console.log("worker start");
	}
	
	var worker = new Worker();
	return worker;
})();

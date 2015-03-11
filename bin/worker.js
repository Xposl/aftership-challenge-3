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

	Worker.prototype.setOptions = function(configs){
		if(!configs
		|| typeof configs !== 'object'){
			return;
		}

		for(var key in options) {
			if(configs
			&& configs.beanTalk 
			&& configs.beanTalk[key] !== undefined) {
				options[key] = configs.beanTalk[key];
			}
		}
		if(typeof configs.handlers === 'object') {
			for(var handler in configs.handlers){
				var handler_args = configs.handlers[handler],
					handler_path = '../handler/'+handler+'.handler';
				if(fs.existsSync('./lib/'+handler_path+'.js')) {
					options.handlers[handler] = require(handler_path)(handler_args);
				}else{
					console.log('Handler Not Found : '+handler);
				}
			}
		}
	};
	
	
	
	Worker.prototype.start = function(configs) {
		var _this = this;
		_this.setOptions(configs);	
				
		console.log("worker init");	
		var worker = new Beanworker(options);
		worker.start(options.tubes);
		console.log("worker start");
	}
	
	var worker = new Worker();
	return worker;
})();

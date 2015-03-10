/**
 * start worker fo aftership challenge
 * author: windrainsky@gmail.com
 */

var configs = require('./config/configs'),
	worker = require('./lib/worker');


worker.start(configs);


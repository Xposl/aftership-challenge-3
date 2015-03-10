/**
 *  mongodb client
 **/

var	mongo = require('mongodb').MongoClient;


module.exports = function (configs) {
	var options = {
			url: '',
			collection: ''
		},
		db,
		error;	

	function Database(configs){
		if(typeof configs === 'object'){
			for(var key in options) {
				options[key] = configs[key];
			} 
		}
	};
	
	Database.prototype.connect = function connect(callback) {
		var mongoUri = process.env.MONGOLAB_URI 
		|| configs.mongodb.url
		|| 'mongodb://localhost/aftership_challenge';
		
		if(db){
			if(typeof callback === 'function') {
				callback();
			}
		}else{
			mongo.connect(mongoUri,function( err, database ) {
				error = err;
				db = database;
				if(typeof callback === 'function') {
					callback();
				}
			});
		}
	};

	Database.prototype.save =  function save(data) {
		this.connect(function(){
			console.log(db);	
		});
	};

	var database = new Database(configs);
	return database;
}

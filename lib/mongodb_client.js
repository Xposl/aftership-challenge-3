/**
 *  mongodb client
 **/

var	mongo = require('mongodb').MongoClient;


module.exports = function (configs) {
	var options = {
			url: 'mongodb://localhost/aftership_challenge',
			collection: ''
		},
		db,
		error;	

	function Database(configs){
		if(typeof configs === 'object'){
			for(var key in configs) {
				options[key] = configs[key];
			} 
		}
	};
	
	Database.prototype.connect = function connect(callback) {
		var mongoUri = process.env.MONGOLAB_URI 
		|| options.url;
		
		if(db){
			if(typeof callback === 'function') {
				callback(0,db);
			}
		}else{
			mongo.connect(mongoUri,function( err, database ) {
				error = err;
				db = database;
				if(typeof callback === 'function') {
					callback(error, db);
				}
			});
		}
	};

	Database.prototype.save =  function save( collection , data ) {
		this.connect(function(err,db){
			db.collection(collection, function(err,col){
    			col.insert(data, function(){
					console.log('Data save successful!');
				});
			});
		});
	};

	var database = new Database(configs);
	return database;
}

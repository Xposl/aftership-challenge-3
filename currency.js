/**
 * Get the on time currency rate from xe.com
 */
var http = require('http');


module.exports = {
	
	/**
     *  convert currency of amount
     *  @parm
     **/
	convert: function (options) {	
		var default_options = {
			url: 'http://www.xe.com/currencyconverter/convert/?',
			scripts: ['http://code.jquery.com/jquery.js'],
			amount: 1,
			from: 'HKD',
			to: 'USD',
			success: null,
			error: null,
			decmicals: 2
		},
		
		result = {
			from: '',
			to: '',
			create_at: null,
			amount: 0,
			value: 0,
			error: 0,
			message: ''
		};

	
	
		if(typeof options !== 'object'){
			options = {};
		}
		for(var key in default_options){
			if(!options[key]){
				options[key] = default_options[key];
			}
		}
		
		//init api url
		options.url = options.url + 'Amount=' + parseInt(options.amout);
		options.url = options.url + '&From=' + options.from.toUpperCase();
		options.url = options.url + '&To=' + options.to.toUpperCase();
		
		//init result
		result.from = options.from;
		result.to = options.to;
		result.amount = options.amount;
	
		//get value from api
		http.get(options.url , function(res) {
			var data = '';
			res.on('data' , function (chunk) {
				data += chunk;
			});	
			res.on('end', function() {
				result.create_at = new Date();

				//here the content data is a html document, so we need to get the value need

				//here get the result element first
				data = data.substring(data.search('ucc-result-table'));
				data = data.substring(0,data.search('</table>'));
				data = data.substring(data.search('uccRes'));
				data = data.substring(0,data.search('</tr>'));
				
				//if the one of from or to currencies is invalid
				if(data.search(options.to.toUpperCase()) >= 0
				&& data.search(options.from.toUpperCase()) >= 0){
					
					data = data.substring(data.search('rightCol'));
					result.value = parseFloat(data.match(/[0-9]+.[0-9]+/)[0]).toFixed(options.decmicals);
					//success
					result.message = 'success';
					if(typeof options.success === 'function'){
						options.success(result);
					}
				}else{
					result.error = 1;
					result.message = options.from + ' or ' + options.to + ' is invalid';
					if(typeof options.error === 'function'){
						options.error(result);
					}
				}
			});
		})
		.on('error' , function(e) {
			result.create_at = new Date();
			result.message = e.message;
			result.error = 1;
			if(typeof options.error === 'function'){
				options.error(result);
			}
		});
	},
	getRate: function (options){
		
		//set amount equal to 1 and get the rate.
		options['amount'] = 1;
		this.convert(options);
	}
};

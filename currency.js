/**
 * Get the on time currency rate from xe.com
 */

module.exports = {
	
	/**
     *  convert currency of amount
     *  @parm
     **/
	convert: function (amount , from , to , decmicals) {
		var api_url = 'http://www.xe.com/currencyconverter/convert/'
			;

		//TODO: get value from xe.com
		return 0;
	},
	getRate: function (from, to , decmicals){
		return this.convert(1,from,to,decmicals);
	}
};

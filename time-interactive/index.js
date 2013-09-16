(function($) {

	// interactive CSS file
	require('../../../css/interactive.js')

	// very basic setup for the element that will hold the interactive
	module.exports.make = function(el, opts) {
		opts = opts || {};
		// make el a $ object
		if (typeof el === "string" && el[0] != "#") {
			el = '#' + el;
		}
		$el = (el instanceof $) ? el : $(el);

		if ($el.length === 0) {
			console.log("Object not found;");
			return;
		}
		$el.addClass("time-interactive");

		if (!opts.keepScreenshot) {
			// remove screenshot
			$el.find(".screenshot").remove();	
		}

		if (opts.headline) {
			$("<div />", {
				html: opts.headline
			}).addClass("headline").appendTo($el);			
		}

		if (opts.intro) {
			$("<div />", {
				html: opts.intro
			}).addClass("intro").appendTo($el);
		}

		// universal tooltip
		$("<div />").addClass("tooltip").appendTo(".time-interactive").get(0);

		// return the DOM object
		return $el.get(0);
	}

	module.exports.loadJSON = function(filename, callback) {
		jQuery.ajax({
			url: filename,
			dataType: 'jsonp',
			jsonpCallback: "ticallback",
	        jsonp: 'callback',
	        contentType: "application/json",
			async: false,
			success: function(d) {
				callback(d);
			}
		});
	}

	module.exports.commafy = function(val){
	    while (/(\d+)(\d{3})/.test(val.toString())){
	      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	    }
	    return val;
	}

}(jQuery));
(function($) {
	// interactive CSS file
	require("./src/interactive.less")

	// this assumes there is already a <div> on the page with the correct id, which Wordpress should have created (see README)
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

		// ought to already have this, but let's be sure
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

		//if (typeof (opts.graybar) === "undefined" || opts.graybar) {
		if (opts.graybar) {
			$("<div />", {
				html: "&nbsp;"
			}).addClass("graybar").appendTo($el);
		}

		// universal tooltip
		$("<div />").addClass("tooltip").appendTo(".time-interactive").get(0);

		// return the DOM object
		return $el.get(0);
	}

	module.exports.loadJSON = function(filename, callback, err) {
		if (!err) {
			err = function(err) { console.log(err); }
		}
		jQuery.ajax({
			url: filename,
			dataType: 'jsonp',
			jsonpCallback: "ticallback",
	        jsonp: 'callback',
	        contentType: "application/json",
			async: false,
			success: function(d) {
				callback(d);
			},
			error: function() {
				if (err) {
					err();
				}
			}
		});
	}

	module.exports.onresize = function(f, delay) {
		delay = typeof delay === undefined ? 100 : delay;
		var resizeTimer;
		$(window).resize(function() { 
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function() {
				f();
			}, delay);
		});
	}


	module.exports.commafy = function(val){
		if (typeof val === "string") {
			val = parseInt(val, 10);
		}

	    while (/(\d+)(\d{3})/.test(val.toString())){
	      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	    }
	    return val;
	}

	module.exports.guid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});		
	}

}(jQuery));
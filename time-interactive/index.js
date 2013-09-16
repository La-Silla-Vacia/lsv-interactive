(function($) {
	// interactive CSS file
	require('../css/interactive.js')
	require("jquery-highlight");

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

			if (opts.highlight_instructions) {
				$(".time-interactive .intro").highlight("mouse over");
				$(".time-interactive .intro").highlight("click");
				$(".time-interactive .intro").highlight("drag");
			}

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

	module.exports.loadCSS = function(url) {
		var $head = $("head");
		var $headlinklast = $head.find("link[rel='stylesheet']:last");
		var linkElement = "<link rel='stylesheet' href='" + url + "' type='text/css'>";
		if ($headlinklast.length){
		   $headlinklast.after(linkElement);
		}
		else {
		   $head.append(linkElement);
		}
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

	module.exports.unique = function(arr) {
	    var u = {}, a = [];
	    for(var i = 0, l = arr.length; i < l; ++i){
	        if(!u.hasOwnProperty(arr[i])) {
	            a.push(arr[i]);
	            u[arr[i]] = 1;
	        }
	    }
	    return a;
	}
}(jQuery));
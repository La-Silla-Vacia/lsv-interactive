(function($) {
	// interactive CSS file
	require("./src/interactive.less")
	require("./src/jquery.highlight.js");

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

			if (opts.highlight_instructions) {
				$(".time-interactive .intro").highlight("mouse over");
				$(".time-interactive .intro").highlight("click");
				$(".time-interactive .intro").highlight("drag");
			}
		}

		if (typeof (opts.graybar) === "undefined" || opts.graybar) {
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
}(jQuery));
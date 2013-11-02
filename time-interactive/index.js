(function($) {
	// interactive CSS file
	require('../../../css/interactive.js')
	require("jquery-highlight");

	//var slider = require("bootstrap-slider");

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

	function addControlPanel(el) {
		if (!$(el).find("#control_panel").length) {
			$("<div />", {
				id: "control_panel"
			})
			.addClass("tw-bs control_panel")
			//.css("display", "inline-block")
			.appendTo(el);		
		}
		return $(el).find("#control_panel");
	}

	module.exports.addControlPanel = addControlPanel;

	module.exports.buttonGroup = function(el, buttons, callback) {
		var cp = addControlPanel(el);
		var group = $("<div />").addClass("btn-group").appendTo(cp);
		//console.log(cp, group);
		$.each(buttons, function(i, v) {
			var button = $("<button />", {
				id: v[0],
				html: v[1]
			}).addClass("btn").addClass("btn-default").appendTo(group);
			if (v[2]) {
				button.addClass("active");
			}
		});

		group.find("button").click(function(e, v) {
			group.find("button").removeClass("active");
			$(e.target).addClass("active");
		    var key = $(e.target).attr("id"),
		    	val = $(e.target).html();
		    if (callback) {
		    	callback(key, val);
		    }
		});
		return group;
	}

	module.exports.slider = function(el, opts) {
		var cp = addControlPanel(el);
		$("<div />").attr("id", opts.id).appendTo(cp).css("width", (opts.width || 300) + "px");
		var slider = $("#" + opts.id).slider(opts);
		return slider;
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
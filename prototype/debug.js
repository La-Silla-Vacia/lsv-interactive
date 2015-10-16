/*global require,jQuery,$,console*/

// require what you need up top
var time = require('time-interactive');
//var d3 = require("d3");

// All of your javascript goes in the time_interactive function below. It will be executed at the appropriate time. 
// It will be passed the $ jQuery shortcode plus an interactive helper object

time("#<%= interactive_id %>", function($, interactive) {
	"use strict";
	var interactiveName="<%= interactive_id %>";

	//var _$  = interactive._$;		// _$ will only find elements inside the current el.
	//var _d3 = interactive._d3;	// _d3 has two methods: select and selectAll, which likewise only look inside this element.

	//CSS
	require("./src/styles.less");

	//MARKUP
	$(require("./src/base.html")({
		headline: "Headline",
		intro: "Introduction goes here."
	})).appendTo(interactive.el);		


	// place any code that doesn't manipulate the DOM here
	// e.g. loading external javascript files, fonts, etc.


	//once you know that everything is loaded
	var checkForReady = function() {
		// check if the $(document).ready() event has occurred
		if ($.isReady) {  //http://stackoverflow.com/questions/8373910/in-jquery-how-do-i-check-if-the-dom-is-ready
			$("body").trigger("time-interactive-ready");  // trigger the time-interactive-ready event
		} else {
			// the $(document).ready() event has not yet occurred
			// so let's install an event handler
			$(document).ready(function() {
				$("body").trigger("time-interactive-ready"); // trigger the time-interactive-ready event
			});
		}
	};

	$("body").on("time-interactive-ready", "", function(event) {
		// the rest of your amazing code here
		// here, you can safely manipulate the DOM 


		// once the interactive is ready, let's tell the hosting page that we are done
		// this could be used for ad rendering etc.
		if (typeof TIME !== "undefined") {
			Time.trigger("timeInteractive:ready", interactiveName, {/* optional other data that the hosting page can use */});
		}
	});

	checkForReady();
}, true);
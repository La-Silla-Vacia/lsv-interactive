// All of your javascript goes in the time_interactive function below. It will be executed at the appropriate time. 

function load_time_interactive($) {
	var time = require('time-interactive');
	/* require() anything else you want here, like d3 */
	//var d3   = require('d3');

	var interactive = time("#<%= interactive_id %>");

	var _$  = interactive._$;		// _$ will only find elements inside the current el. 
	//var _d3 = interactive._d3;	// _d3 has two methods: select and selectAll, which likewise only look inside this element.

	//CSS
	require("./src/styles.less");

	//MARKUP
	$(require("./src/base.html")({
		headline: "Headline",
		intro: "Introduction goes here."
	})).appendTo(interactive.el);		

	// the rest of your amazing code here
}


// this code will execute time_interactive() when the DOM is ready. You're welcome to modify it, but generally you shouldn't have to
(function($) {
	var time_interactive_loaded = false;

	// check if the DOM element we need is there
	if ($("#<%= interactive_id %>").length) {
		//console.log("Document was already ready.");
		load_time_interactive($);
	} else {
		// there might be a better event here to listen for
		console.log("The document wasn't ready yet when <%= interactive_id %> loaded, so we'll wait for it.")
		$(document).ready(function() {
			console.log("Document now ready for <%= interactive_id %>");
			load_time_interactive($);
		});
	}
}(window.jQuery));
// require what you need up top
var time = require('time-interactive');
//var d3 = require("d3");

// All of your javascript goes in the time_interactive function below. It will be executed at the appropriate time. 
// It will be passed the $ jQuery shortcode plus an interactive helper object

time("#<%= interactive_id %>", function($, interactive) {

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
});
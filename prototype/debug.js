(function($) {
	var time = require('time-interactive');

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

}(window.jQuery));
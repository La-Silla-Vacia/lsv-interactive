(function($) {
	var time = require('time-interactive');	
	//var d3 = require('d3');

	var el = time.make("<%= interactive_id %>", {
		headline: "<%= headline %>",
		intro: ""
	});

	//CSS
	require("./src/styles.less");

}(window.jQuery));


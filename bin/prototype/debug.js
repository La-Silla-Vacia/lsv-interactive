(function($) {
	var time = require('time-interactive');	
	//var d3 = require('d3');
	//require("bootstrap");

	var el = time.make("<%= interactive_id %>", {
		headline: "<%= headline %>",
		intro: ""
	});

	//CSS
	require("./styles.less");

}(window.jQuery));


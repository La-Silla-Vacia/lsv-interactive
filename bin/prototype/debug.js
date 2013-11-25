(function($) {
	var time = require('time-interactive');	
	var d3 = require('d3');

	//var base = require('d3-base');
	//var map = require('maps');
	//var chart = require('chart');

	var el = time.make("<%= interactive_id %>", {
		headline: "<%= headline %>",
		intro: ""
	});

	//CSS
	require("./styles.less");
	//require("bootstrap");

}(window.jQuery));


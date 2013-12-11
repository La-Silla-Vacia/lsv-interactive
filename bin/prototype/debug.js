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


	//var b = base(el);

	/* 
	//SAMPLE MAP

	var m = map.make(b.svg, b.svg, "states", function(states) {
		d3.selectAll("#states path")
			.each(function(d) {
				if (data[d.properties.st]) {
					d.data = data[d.properties.st];
				}
			})
			.tooltip(over);	
	});

	var ch = chart.make(b.svg, {
		title: "Energy Consumption by Source, 1973-2012",
		margin: {top: 40, right: 10, bottom: 20, left: 30},
		height: 260
	});

	// scales
	var x = ch.makeScale(null, "x", {
		type: "time",
		domain: [format.parse("1973"), format.parse("2012")]
	});

	var y = ch.makeScale(null, "y", {
		domain: [0, 120],
		id: "yax",
		label: "Quadrillion BTU",

	});
	
	*/

}(window.jQuery));


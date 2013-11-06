// make a topojson-powered D3 map

var d3 = require('d3');
var projections = require('d3-geo-projection')
var utils = require('time-interactive')

require('topojson/topojson.min');

var geo_data = {

}

//PREFIX = "http://content.time.com/time/wp/interactives/data/geo/";
//PREFIX = "../../node_modules/maps/topojson/";
//PREFIX = "/data/geo/"
PREFIX = "/Dropbox/Private/time/data/geo/"

var supported_types = {
	states: PREFIX + "states.json",
	counties: PREFIX + "counties.json",
	countries: PREFIX + "world_110m.json",
	countries_large: PREFIX + "world_50m.json",
	congress: PREFIX + "congress.json"
};

var map = function(svg, parent, type, callback, opts) {
	opts = opts || {};

	type = type || "states";
	var borders = (typeof opts.borders === "undefined") ? true : opts.borders;
	var id = opts.id;

	if (!supported_types.hasOwnProperty(type)) {
		console.log("Unknown type \"" + type + "\"");
		return;
	}

	if (parent === "undefined") {
		console.log("Must supply a parent");
		return;
	}

	var key = type; 

	if (opts.size) {
		key += "_" + opts.size;
	}

	if (!opts.offset) {
		opts.offset = [0,0,1];
	}

	if (geo_data.hasOwnProperty(supported_types[key])) {
		console.log("already loaded that geography.");
		return init(geo_data[supported_types[key]]);
	} else {
		jQuery.ajax({
			url: supported_types[key],
			dataType: 'jsonp',
			jsonpCallback: "ticallback",
	        jsonp: 'callback',
	        contentType: "application/json",
			async: false,
			success: function(d) {
				init(d);
			},
			error: function(a,b,c) {
			}
		});
	}

	function init(geography) {
		if (opts.onComplete) {
			opts.onComplete();
		}

		var width = parseInt(svg.style('width'), 10);
		var height = parseInt(svg.style('height'), 10);
		var original_width = width;

		if (type === "countries") {
			console.log(width);
			var projection = d3.geo[geography.projection]()
		        .translate([900 / 2 + opts.offset[0], 450 * 0.6 + opts.offset[1]])
		        .scale(900 / 4 * 0.78 * (opts.offset[2] || 1));
		} else {
			geography.preprojected = true;
			var projection = d3.geo.albersUsa();
		}

		if (!geography.preprojected) {
			var path = d3.geo.path()
			    .projection(projection);		
		} else {
			var path = d3.geo.path().projection(null);
		}

		var layer = parent.append("g")
			.attr("id", id || type)
			.classed("geo_collection", true)
			.classed(id || type, true);

		if (geography.hasOwnProperty("geography")) {
			geography = geography.geography;
		}

		if (borders) {
			var stroke_width = opts.stroke_width || 1;
			layer.selectAll("path")
				.data(topojson.feature(geography, geography.objects[type]).features)
				.enter()
			  .append("path")
		    	.attr("d", function(d) {
		    		return path(d);
		    	})
		    	.attr("id", function(d) { return d.id; })
		    	.style("stroke-width", stroke_width);    	 

		} else {
			var stroke_width =  opts.stroke_width || 1;
			layer.append("path")
		    	.datum(topojson.mesh(geography, geography.objects[type], function(a, b) { return a !== b; }))
		    	.attr("d", function(d) {
		    		return path(d);
		    	})
		    	.style("stroke-width", stroke_width)	    	
		    	.style("fill", "none");
		}

		//var original_width = layer[0][0].getBBox().width;

		var resizeTimer;

		jQuery(window).resize(function() { 
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function() {
				resize();
			}, 100);
		});

		function resize() {
			var width = parseInt(svg.attr('width'), 10);
			var height = parseInt(svg.attr('height'), 10);
			var z = width / 900;
			console.log(width, z);
			//var overflow = width * (1-z) / 2;
			//overflow = -layer[0][0].getBBox().x;

			layer.selectAll("path").style("stroke-width", stroke_width / z );
			layer.attr("transform", "scale(" + z + "," + z + ")");//translate(" + opts.offset[0] + "," + opts.offset[1] + ")");

			//layer.selectAll("path").attr("d", path);
		}
		resize();
		callback({
			data: topojson.feature(geography, geography.objects[type]).features,
			projection: projection
		});
	}
}

module.exports.make = map;
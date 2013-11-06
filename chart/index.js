// make a D3 chart

var d3 = require('d3');
var utils = require('time-interactive')

var chart = function(parent, opts) {
	opts = opts || {};

	if (parent === "undefined") {
		console.log("Must supply a parent");
		return;
	}

	var margin = opts.margin || {top: 20, right: 50, bottom: 30, left: 40};

	var width = parseInt(parent.style('width'), 10) - margin.right - margin.left;
	var height = parseInt(parent.style('height'), 10) - margin.top - margin.bottom;

	var original_width = width;

	if (opts.title) {
		parent.append("text")
		    .attr("x", width / 2)
		    .attr("y", 25)
		    .style("text-anchor", "middle")
		    .attr("class", "chart_title")
		    .text(opts.title);
	}

	var layer = parent.append("g")
		.classed("chart", true)
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// the axes should NOT be resized with a transformation -- much better to resize them directly to allow for labels to condence
	// anything on this sublayer WILL resize with change in screen size
	var resize_layer = layer.append("g");

	var scales = [];

	var resizeTimer;

	jQuery(window).resize(function() { 
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			resize();
		}, 100);
	});

	var stroke_width = 1;

	function resize() {
		var w = parseInt(parent.style('width'), 10) - margin.right - margin.left;
		var h = parseInt(parent.style('height'), 10) - margin.top - margin.bottom;
		var z = w / original_width;

		width = w;
		height = h;

		resize_layer.attr("transform", "scale(" + z + ",1)");

		scales.forEach(function(obj) {
			obj.resize(z);
		});

		if (opts.resize) {
			opts.resize(w, h, z);
		}

	}
	//resize();
	

	return {
		g: layer,
		canvas: resize_layer,
		height: height,
		width: width,
		resize: function(rf) {
			opts.resize = rf;
		},
		makeScale: function(data, dir, opts) {
			dir = dir || "x";
			opts = opts || {};

			if (typeof opts.offset === "undefined") {
				opts.offset = dir.toLowerCase() === "x" ? height : 0;
			}
			opts.domain = opts.domain || d3.extent(data);
			if (typeof opts.min !== "undefined") {
				opts.domain[0] = opts.min;	
			}
			if (typeof opts.max !== "undefined") {
				opts.domain[1] = opts.max;	
			}

			opts.type = opts.type || "quantitative";

			var scale;
			switch(opts.type) {
				case "time": scale = d3.time.scale(); break;
				case "ordinal": scale = d3.scale.ordinal(); break;
				default: scale = d3.scale.linear(); break;
			}

			if (opts.type === "ordinal") {
				if (opts.range) {
					scale.rangeRoundBands(opts.range).domain(opts.domain);
				} else {
					scale.rangeRoundBands(dir.toLowerCase() === "x" ? [0, width] : [height, 0]).domain(opts.domain);
				}
			} else {
				if (opts.range) {
					scale.range(opts.range).domain(opts.domain);
				} else {					
					scale.range(dir.toLowerCase() === "x" ? [0, width] : [height, 0]).domain(opts.domain);
				}
			}
			
			var axis = d3.svg.axis().scale(scale);

			if (opts.tick_format) {
				axis.tickFormat(opts.tick_format);
			}

			if (!opts.hidden) {

				var ax = layer.append("g").attr("class", dir.toLowerCase() + " axis");

				if (opts.id) {
					ax.attr("id", opts.id);	
				}

				if (dir.toLowerCase() === "x") {
					opts.orientation = opts.orientation || "bottom";
					if (opts.orientation === "top") {
						ax.attr("transform", "translate(0,0)")
					} else {
						ax.attr("transform", "translate(0," + opts.offset + ")")
					}
					axis.orient(opts.orientation);
					if (opts.label) {
						ax.append("text")
						    .attr("x", width)
						    .attr("y", opts.orientation === "top" ? -25 : 25)
						    .style("text-anchor", "end")
						    .attr("class", "axis_label")
						    .text(opts.label);
					}
				} else {
					ax.attr("transform", "translate(" + opts.offset + ", 0)")
					axis.orient("left");
					if (opts.label) {
						ax.append("text")
						    .attr("transform", "rotate(-90)")
						    .attr("x", opts.label_offset || 0)
						    .attr("y", -35)
						    .attr("dy", ".71em")
						    .style("text-anchor", "end")
						    .attr("class", "axis_label")
						    .text(opts.label);
					}
				}

				ax.call(axis);
			}

			var update = function(dur) {
				if (dur) {
					ax.transition(dur).call(axis);
				} else {
					ax.call(axis);
				}
			}


			var resize = function (z) {
				if (opts.type === "ordinal") {
					scale.rangeRoundBands(dir.toLowerCase() === "x" ? [0, width] : [height, 0])
						.domain(opts.domain);
				} else {
					scale.range(dir.toLowerCase() === "x" ? [0, width] : [height, 0])
						.domain(opts.domain);
				}

				if (opts.resize) {
					opts.resize(scale, axis, width, height, z);
				}
				update();			
			}

			var obj = {
				scale: scale,
				axis: axis,
				resize: resize,
				update: update
			};

			scales.push(obj);

			return obj;
		}		
	}
}

module.exports.make = chart;
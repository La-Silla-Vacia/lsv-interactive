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

	var layer = parent.append("g")
		.classed("chart", true)
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	
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
		width = parseInt(parent.style('width'), 10) - margin.right - margin.left;
		height = parseInt(parent.style('height'), 10) - margin.top - margin.bottom;
		var z = width / original_width;

		layer.selectAll("path").style("stroke-width", stroke_width / z );

		scales.forEach(function(obj) {
			obj.resize(z);
		});
	}
	//resize();
	

	return {
		g: layer,
		height: height,
		width: width,
		makeScale: function(data, dir, opts) {
			dir = dir || "x";
			opts = opts || {};

			opts.offset = typeof opts.offset === "undefined" ? height : opts.offset;
			opts.domain = opts.domain || d3.extent(data);
			if (typeof opts.min !== "undefined") {
				opts.domain[0] = opts.min;	
			}
			if (typeof opts.max !== "undefined") {
				opts.domain[1] = opts.max;	
			}

			opts.type = opts.type || "quantitative";

			var scale = opts.type[0].toLowerCase() === "t" ? d3.time.scale() : d3.scale.linear();

			scale.range(dir.toLowerCase() === "x" ? [0, width] : [height, 0])
				.domain(opts.domain);

			var axis = d3.svg.axis()
			    .scale(scale);

			if (opts.tick_format) {
				axis.tickFormat(opts.tick_format);
			}

			var ax = layer.append("g").attr("class", "axis");

			if (opts.id) {
				ax.attr("id", opts.id);	
			}

			if (dir.toLowerCase() === "x") {
				ax.attr("transform", "translate(0," + opts.offset + ")")
				axis.orient("bottom");
			} else {
				ax.attr("transform", "translate(" + opts.offset + ", 0)")
				axis.orient("left");
				if (opts.label) {
					ax.append("text")
					    .attr("transform", "rotate(-90)")
					    .attr("y", 6)
					    .attr("dy", ".71em")
					    .style("text-anchor", "end")
					    .attr("class", "axis_label")
					    .text(opts.label);
				}
			}

				
			ax.call(axis);

			var update = function() {
				ax.call(axis);
			}


			var resize = function (z) {
				scale.range(dir.toLowerCase() === "x" ? [0, width] : [height, 0])
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
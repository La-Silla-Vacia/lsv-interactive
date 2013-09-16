(function($) {

var components = {};
module.exports.components = components;

function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    var ua = navigator.userAgent;
    var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null) {
        rv = parseFloat(RegExp.$1);
    }
    return rv;
}

var rv = getInternetExplorerVersion();

if (rv > -1 && rv < 9) {
	$("<div />", {
		html: "Your browser is not up to date. It may not display the features of this and other websites. Please consider <a href='http://browsehappy.com/'>upgrading your browser</a>."
	}).addClass("ie8_warning").appendTo(".time-interactive");

	module.exports = null;
	return
} 

var d3 = require('d3');

module.exports = function(parent, hght, before) {
	// setup
	if (!parent) {
		console.log("You must supply a parent");
		return;
	}

	var zoom = d3.behavior.zoom().scaleExtent([1, 5]);

	var components = {};
	hght = hght || 0.618;

	// specs
    components.width = $(parent).width();
    // height can be a ratio or a fixed value
    components.height = hght < 1 ? components.width * hght : hght;

    if (before) {
    	components.svg = d3.select(parent)
	    	.insert("svg", ":first-child");
    } else {
    	components.svg = d3.select(parent)
    		.append("svg");
    }

    components.g = components.svg
		.attr("width", components.width)
		.attr("height", components.height)
	    .attr("pointer-events", "all")
		.call(zoom.on("zoom", redraw))
		.append("g");

	function redraw() {
		var t = d3.event.translate,
			s = d3.event.scale;

		var x_over = components.width * (s - 1);

		t[0] = Math.max(-components.width * (s - 1), Math.min(0, t[0]));
		t[1] = Math.max(-components.height * (s - 1), Math.min(0, t[1]));
		zoom.translate(t);
		components.g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");		
	}

	function resize() { 
		zoom.scale(1);

		components.g.style("stroke-width", 1).attr("transform", "translate(0,0)scale(1)");		

		components.width = $(parent).width();
	    // height can be a ratio or a fixed value
	    components.height = hght < 1 ? components.width * hght : hght;
	    components.svg
			.attr("width", components.width)
			.attr("height", components.height);
	}


	var resizeTimer;

	$(window).resize(function() { 
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			resize();
		}, 100);
	});

	return components;
}


module.exports.makeLegend = function(svg, title, vals, x, y, dir) {
	dir = dir || "vert";
	x = typeof x !== "undefined" ? x : 10;
	y = typeof y !== "undefined" ? y : 10;

	svg.select("#legend").remove();

	svg.append("text")
		.attr("x", x)
		.attr("y", y)
		.text(title)
		.attr("class", "subhead");

	var legend = svg
		.append("g")
		.attr("id", "legend")
		.attr("transform", "translate(" + x + "," + (y + 8) + ")");

	var items = legend.selectAll(".legend").data(vals).enter().append("g").attr("class", "legend");

	if (dir[0] == 'v') {
		var box_width = 20,
		    box_height = 20;		
	} else {
		var box_width = parseInt(svg.attr('width'), 10) / (vals.length + 1),
		    box_height = 20;				
	}


	items.append("rect")
		.attr("x", function(d, i) { return (dir[0] === "h") * (box_width + 5) * i; })
		.attr("y", function(d, i) { return (dir[0] === "v") * (box_height + 5) * i; })
		.attr("id", function(d, i) { return "back-" + i; })
		.attr("width", box_width)
		.attr("height", box_height)
		.style("fill", function(d) { return d.color; });
	  
	items.append("text")
		.attr("class", "legend_label")    
		.attr("x", function(d, i) { return (dir[0] === "h") * (box_width + 5) * i + (dir[0] === "v") * (box_width + 5); })
		.attr("y", function(d, i) { return (dir[0] === "v") * (box_height + 5) * (i + 0.5); })
		.attr("dy", ".35em")
		.style("text-anchor", "start")
		.style("font-size", box_width < 20 ? 10 : 12);

	var max_text = d3.max(items.selectAll("text").map(function(d) {
		return d[0].offsetWidth;
	}));

	if (max_text + 6 < box_width) {
		items.selectAll("text").attr("transform", "translate(3, 10)");

		/*
		.style("text-anchor", function(d, i) {
			return (d < vals.length / 2) ? "start" : "end";
		}); */
	} else {
		items.selectAll("text").attr("transform", "translate(3, 10)").html(function(d) {
			//console.log(d);
			return "<tspan>" + d.label.split("-")[0] + "-</tspan><tspan>" + d.label.split("-")[1] + "</tspan>";
		});
	}
}

module.exports.makeSizeLegend = function(svg, title, vals, x, y, dir) {
	dir = dir || "vert";
	x = typeof x !== "undefined" ? x : 10;
	y = typeof y !== "undefined" ? y : 10;

	svg.select("#sizelegend").remove();

	svg.append("text")
		.attr("x", x)
		.attr("y", y)
		.text(title)
		.style("font-size", "12px")
		.style("fill", '#666')
		.attr("class", "subhead");

	var sizelegend = svg
		.append("g")
		.attr("id", "legend")
		.attr("transform", "translate(" + x + "," + (y + 16) + ")");

	var items = sizelegend.selectAll(".legend").data(vals).enter().append("g").attr("class", "legend");

	var box_width = vals[vals.length - 1].radius + 5;

	items.append("circle")
		.attr("cx", function(d, i) { return (dir[0] === "h") ? box_width * (2 * i + 1) : box_width; })
		.attr("cy", function(d, i) { return (dir[0] === "h") ? 0 : ((box_width) * (0.5 + i)); })
		.attr("id", function(d, i) { return "back-" + i; })
		.attr("r", function(d) { return d.radius; })
		.style("fill", function(d) { return d.color; });
	  
	items.append("text")
		.attr("class", "legend_label")    
		.attr("x", function(d, i) { return (dir[0] === "h") ? box_width * (2 * i + 1) : (box_width + 15); })
		.attr("y", function(d, i) { return (dir[0] === "h") ? (box_width + 5) : ((box_width + 5) * (i + 0.5)); })
		.attr("dy", ".35em")
		.style("text-anchor", "middle")
		.style("font-size", box_width < 20 ? 10 : 12)
		.text(function(d) { return d.label; });     

}

module.exports.makeFlatLegend = function(title, parent, legend) {
	$("<div />").addClass("legend-title").html(title).appendTo(parent);
	$("<ul />").appendTo(parent);

	d3.select("#control_panel .legend ul")
		.selectAll("li")
		.data(legend)
		.enter()
		.append("li")
		.style("background-color", function(d) {
			return d.color;
		})
		.style("width", 90 / legend.length + "%")
		.style("color", function(d) {
			var hsl = d3.hsl(d.color);
			if (hsl.l > 0.70) {
				return "#000";
			}
			return "#FFF";
		}).html(function(d) {
			return d.label;
		});
}

// some d3 extensions
d3.selection.prototype.toFront = function() {
	return this.each(function(){
		this.parentNode.appendChild(this);
	});
};

var tooltip = d3.select("body").append("div").classed("d3tooltip", true);

d3.selection.prototype.tooltip = function(f) {		
	this //.on("click", function(d) { tooltip.html(typeof f === "function" ? f(d) : f); tooltip.classed("clicked", "true"); tooltip.style("visibility", "visible"); })
		.on("mouseover", function(d) { 
			tooltip.html(typeof f === "function" ? f(d) : f); tooltip.style("visibility", "visible");
		})
		.on("mousemove", function() { 
			return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
		})
		.on("mouseout", function() { 
			return tooltip.style("visibility", "hidden");
		});            


};

function blockScroll() { 
	//d3.event.preventDefault();
}

}(window.jQuery));
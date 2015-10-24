/*global require,jQuery,$,console*/

// require what you need up top. You can also use this space for any code that does NOT need the DOM present in order to load
var time = require('time-interactive');
//var d3 = require("d3");

// All of your DOM-sensitive javascript goes in the time_interactive function below. It will be executed at the appropriate time. 
// It will be passed the $ jQuery shortcode plus an interactive helper object

time("#<%= interactive_id %>", function($, interactive) {
	"use strict";
	var interactiveName="<%= interactive_id %>";

	//var _$  = interactive._$;		// _$ will only find elements inside the current el.

	//CSS
	require("./src/styles.less");

	//MARKUP
	$(require("./src/base.html")({
		headline: "Headline",
		intro: "Introduction goes here."
	})).appendTo(interactive.el);		


	// place any code that doesn't manipulate the DOM here
	// e.g. loading external javascript files, fonts, etc.


}, false); // change this last param to true if you want to skip the DOM checks
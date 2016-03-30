/*global require,jQuery,$,console*/

// require what you need up top. You can also use this space for any code that does NOT need the DOM present in order to load
var time = require('time-interactive');

// All of your DOM-sensitive javascript goes in the time_interactive function below. It will be executed at the appropriate time. 
// It will be passed the `$` shortcut for `jQuery` plus an interactive helper object

time("#<%= interactive_id %>", function($, interactive) {
	"use strict";
	var _$  = interactive._$; // _$ will only find elements inside the current el.

	//CSS
	require("./src/styles.less");

	//MARKUP
	$(require("./src/base.html")({
		headline: "Headline",
		intro: "Introduction goes here."
	})).appendTo(interactive.el);		

	// your code here

}, false); // change this last param to true if you want to skip the DOM checks
/*global require,jQuery,$,console*/

var time = require('time-interactive');

require("./src/styles.less"); // this goes outside the callback since otherwise the interactive sometimes fires before the CSS is fully loaded

time("#<%= interactive_id %>", function($, interactive) {
	"use strict";

	if (!interactive) {
		console.log("Interactive <%= interactive_id %> not initiated. Exiting.");
		return;
	}

	//MARKUP
	$(require("./src/base.html")()).appendTo(interactive.el);		

	// your code here

}, false); // change this last param to true if you want to skip the DOM checks
/*global require,console*/

var time = require('time-interactive');

require("./src/styles.less"); // this goes outside the callback since otherwise the interactive sometimes fires before the CSS is fully loaded

time("<%= interactive_id %>", function(interactive) {
	"use strict";

	if (!interactive) {
		console.log("Interactive <%= interactive_id %> not initiated. Exiting.");
		return;
	}

	//MARKUP
	interactive.el.innerHTML = require("./src/base.html")();	

}, true); // change this last param to true if you want to skip the DOM checks
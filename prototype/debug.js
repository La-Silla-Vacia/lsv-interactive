(function() {
	// loop through all instances of this app on the page in case we're using it multiple times
	jQuery("#<%= interactive_id %>").each(function(i, el) {
		var time = require('time-interactive');

		var interactive = time(el),
			$ = interactive.$; 		

		/* 
		The variable $ will only find elements inside the current el.
		To select elements outside the interactive, which you should only be doing with good reason, use `jQuery`
		*/

		//CSS
		require("./src/styles.less");

		//MARKUP
		$(require("./src/base.html")({
			headline: "Headline",
			intro: "Introduction goes here."
		})).appendTo(interactive.el);		
	});
}());
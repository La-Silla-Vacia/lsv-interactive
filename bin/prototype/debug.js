(function($) {
	var time = require('time-interactive');	

	var el = time("<%= interactive_id %>");

	//CSS
	require("./src/styles.less");

	//MARKUP
	require("./src/base.html")({
		headline: "Headline",
		intro: "Introduction goes here."
	}).appendTo(el);

}(window.jQuery));


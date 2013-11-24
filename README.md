Core Time Interactive files
====

Time.com interactives are bootstrapped onto pages with a Wordpress short code:

	[time-interactive id=_<unique_id_of_interactive>_]

The short code creates a ```<div>``` at its location in the page with the following markup:

	<div id="_<unique_id_of_interactive>_" class="time-interactive">
		<img src="http://www.time.com/time/wp/interactives/apps/_<unique_id_of_interactive>_/screenshot.png" class="screenshot" style="width:100%;">
	</div>

Second, it appends a script to the end of the page:

	<script type='text/javascript' src='http://www.time.com/time/wp/interactives/apps/_<unique_id_of_interactive>_/script-min.js'></script>

This is the extent of an interactive's purchase on the DOM at page load time. All further elements must be self-assembled from the script.

## Installation

//TK

## Scripting

The ```script.js``` file is compiled using [Browserify](https://github.com/substack/node-browserify) and minified automatically when uploaded. Browserify allows one to write client-side applications in Node, using ```require()``` to draw in other libraries as needed.

The ```index.js``` file in this repository includes some very basic scripts to get up and running on the page. After installing in ```node_modules```, you can instantiate a new interactive like so:

	require("time-interactive");
	// initialize object	
	var el = time.make(_<unique_id_of_interactive>_);

### options

+ ```headline```: The headline at the top of the interactive. Default: none
+ ```keepscreenshot```: Do not delete the screenshot when the interactive loads. Default: false.
Guide to Time.com Interactives
====

[![Build Status](https://travis-ci.org/TimeMagazine/time-interactive.png)](https://travis-ci.org/TimeMagazine/time-interactive) [![Dependency Status](https://david-dm.org/TimeMagazine/time-interactive.svg)](https://david-dm.org/TimeMagazine/time-interactive)

v0.0.7

Our interactives at Time are developed independently from the CMS and bundled into self-assembling Javascript files using [browserify](https://www.npmjs.org/package/browserify). They are both discrete--requiring no dependencies--and discreet--interfering as little as possible with the rest of the page. 

This repository provides both a [command-line script](/bin/generate.js) for generating new projects and a [client-side script](/index.js) with a few convenience functions.

## Installation

We'll assume you have [installed Node](http://nodejs.org/). You can then install the Time Interactive repo like so:

	npm install -g time-interactive

It's important to [install it globally](http://blog.nodejs.org/2011/03/23/npm-1-0-global-vs-local-installation) (hence the `-g` flag) since the module comes with a command-line function that you'll want to run in the shell from any location. Depending on how you installed Node, you [may need to run this](http://howtonode.org/introduction-to-npm) command with `sudo`. 

## Getting started

The `time-interactive` command runs a script called [`generate`](bin/generate.js) that creates a new skeleton project. It takes two command-line arguments: The unique id of the interactive and the directory to which it should install.

	time-interactive my_test_app ./apps

By default, if the second argument is missing, the script creates a new folder in the current directory.

This script creates a handful of files:

+ `debug.js` is your main file for writing client-side Javascript with the help of Node-style `require()` statements. You'll see some default code in there to get you started.
+ `index.html` is an HTML file for previewing your app after it is bundled.
+ `package.json` is a set of instructions for Node and Browserify, including transforms that Browserify needs to correctly include LESS and CSV files in the interactive.
+ `src/styles.less` is the stylesheet for this interactive, using the [LESS](http://lesscss.org/) dynamic style sheet language.
+ `src/base.html` is the app-specific HTML for this interactive. By default, it's only a headline and introduction.
+ `screenshot.png` is the image that is loaded by default and then overwritten when the interactive loads. The default is an 800x1 white image.

### How it works

Run `time-interactive my_test_app ./apps` and you'll see that it creates a folder called `my_test_app` in the `apps` directory (which it will also create if such a directory doesn't exist). That new folder includes a `debug.js` that looks like this:

	(function($) {
		var time = require('time-interactive');	
		var interactive = time("my_test_app");

		//CSS
		require("./src/styles.less");

		//MARKUP
		$(require("./src/base.html")({
			headline: "Headline",
			intro: "Introduction goes here."
		}).appendTo(interactive.el);
	}(window.jQuery));

If you look inside `index.html`, however, you'll see that it references a file called `script.js`, which does not exist in the repo. That's because you need to run the Browserify command to take the highly modular, clean code from `debug.js` and compile it into a single file:

	browserify debug.js > script.js

That command uses the [node-lessify](https://www.npmjs.org/package/node-lessify) module that Chris Wilson maintains to compile the LESS syntax in `styles.less` into valid CSS and wrap it in Javascript that appends that CSS to the DOM at run time. This will happen automatically when you run the `browserify` command inside the `my_test_app` directory.

Once you've compiled that script, you can preview the app by opening `index.html`. It is recommended that you do so on a local server instead of via the `file://` schema. 

## The `interactive` object

Use of the `time()` function is not strictly necessary for an app, but it's very lightweight and comes with a few handy properties:

+ `el`: The top-level DOM element of the app
+ `modernizr`: A few Modernizr tests for detecting devices and compatibilities
+ `width`: A *function* that, when invoked (e.g., `interactive.width()`) return the width of the parent element at that time
+ `height`: Same as above for the height
+ `width`: A *function* that, when invoked (e.g., `interactive.width()`) return the width of the parent element at that time
+ `page_width`: the width of the entire page,
+ `page_height`: the height of the entire page
+ `aspect_ratio`: page ratio (w/h), useful for adjusting for wide desktops vs tall phones,
+ `params`: Object with any key-value parameters from the WP shortcode (see below)
+ `detections`: a few useful Modernizr tests: audio, canvas, geolocation, postmessage, svg, touchevents, webgl, websockets


## Automatic browserify-ification

###To run browserify in Intellij:

Goto IntelliJ - Preferences - External Tools, and click the plus button on the [lower, left corner](http://screencast.com/t/rAAc50bQyWWg)

###To add the browserify command to a toolbar:
Goto IntelliJ - Preferences - Menus and Toolbars, and click on the arrow next to "Main Toolbar", select the position the browserify is supposed to appear, click on "Add After" button and add the browserify external tool action.

###Beefy
You can also use [beefy](https://github.com/chrisdickinson/beefy) to automatically compile the `script.js` file each time you make a change to `debug.js`.

## Deployment

Time.com interactives are bootstrapped onto pages with a Wordpress short code:
 
	[time-interactive id=<unique_id_of_interactive>]

The short code creates a ```<div>``` at its location in the page with the following markup:

	<div id="<unique_id_of_interactive>" class="time-interactive">
		<img src="http://www.time.com/time/wp/interactives/apps/<unique_id_of_interactive>/screenshot.png" class="screenshot" style="width:100%;">
	</div>

Second, it appends a script to the end of the page:

	<script type='text/javascript' src='http://www.time.com/time/wp/interactives/apps/<unique_id_of_interactive>/script-min.js'></script>

This is the extent of an interactive's purchase on the DOM at page load time. All further elements must be self-assembled from the script.

When the code you've written in `debug.js` is ready for deployment, pipe it through a minifier to a file named `script-min.js`:

	npm install -g uglifyjs
	browserify debug.js | uglifyjs > script-min.js

The beauty of the bundled scripts is that they can live anywhere when combined with the `index.html` file, which mimics the markup created by the short code.

### Parameters

Some interactives will function more like tools that live on many pages and accept inputs about which files to load and so forth. You can pass any information you like to the interactive from Wordpress by adding a `params` argument to the shortcode. The format is like a URL parameter (interpreted with the PHP function [`parse_str`](http://php.net/parse_str) under the hood.)

	[time-interactive id=my_app params="src_data=employment&highlightcolor=red"]

## Best practices

Since these apps are designed to run smoothly on a page in which many other Javascript libraries are firing, it's important to minimize the possibility of namespace collisions and other unwanted consequences.

### Scope
You will notice that, default, the code in `debug.js` runs inside a closure that passes `jQuery` to a variable named `$`, which is necessary since the jQuery script that on Time.com runs in `.noConflict()` mode. (Browserify further wraps modules in closures for extra effect.)

Beyond jQuery, our apps have no dependencies on external scripts. If you want to use a third-party library, you have to `require()` it in `debug.js`, thus bundling it into the final `script.js`. While this can push up the file size of the final app, it's a reasonable tradeoff for an entire project that loads and assembles with a single HTTP request.

### Selectors

All Time.com interactives should run inside the ```.time-interactive``` selector--that is, the class automatically assigned to the parent ```<div>```. They should not be messing with the DOM outside of this element without a specific reason to do so (such as tweaking a template).

One of the reasons we use LESS for stylesheets is that it allows us to easily wrap this class around all styles specific to the interactive, thus preventing them from screwing up the styling of the page. Likewise, *all jQuery selectors should start with .time-interactive.* Otherwise, there is a risk that an ID assigned to something inside the interactive will also appear elsewhere.

By default, a new script requires the ```time-interactive``` script [included in this repo](/index.js), which contains some convenience functions for getting started. Running `var interactive = time("my_test_app")` adds the necessary classes and ids to the parent `<div>` and removes the screenshot that is included on page load. 
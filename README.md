Core Time Interactive files
====

Time.com interactives are bootstrapped onto pages with a Wordpress short code:
 
	[time-interactive id=<unique_id_of_interactive>]

The short code creates a ```<div>``` at its location in the page with the following markup:

	<div id="<unique_id_of_interactive>" class="time-interactive">
		<img src="http://www.time.com/time/wp/interactives/apps/<unique_id_of_interactive>/screenshot.png" class="screenshot" style="width:100%;">
	</div>

Second, it appends a script to the end of the page:

	<script type='text/javascript' src='http://www.time.com/time/wp/interactives/apps/<unique_id_of_interactive>/script-min.js'></script>

This is the extent of an interactive's purchase on the DOM at page load time. All further elements must be self-assembled from the script.

From here, it is up to you how to want to manipulate the DOM. Everything that follows is a suggested workflow for bundling HTML, Javascript and CSS into a single file that can assemble itself on the page. This method allows for effective decoupling of the interactives from the CMS.

## Overview

In order to minimize the possibility of namespace collisions, each interactive and its dependencies is bundled into a single script using [Browserify](https://github.com/substack/node-browserify), which allows one to write client-side applications in Node. This single script runs inside a closure so as not to interfere with the myriad other scripts on a Time.com page.

## Installation

To set up your environment, clone this repo and then install the dependencies:

	git clone git@github.com:TimeMagazine/time-interactive.git
	cd time-interactive
	npm install

You can optionally pass ```-g``` to the ```npm install``` command to install the scripts globally. This may require ```sudo``` access. 

## Getting started

The module comes with a script called ```generate``` that creates a new skeleton project. It takes two command-line arguments: The unique id of the interactive and a headline.

	./bin/generate.js my_test_app "My Test Application"

(If you installed the scripts globally, this may work by using ```time-interactive``` from the command line.)

By default, this creates a new folder in the current directory. You can change that location by adding the following to the ```package.json``` file: 

    "time-interactive": {
        "app_dir": "/path/to/my/app/folder/"
    }

This script creates five files:

+ ```debug.js``` is your main file for writing Javascript. You'll see some default code in there to get you started.
+ ```styles.less``` is the stylesheet for this interactive, using the [LESS](http://lesscss.org/) dynamic style sheet language. By default, ```debug.js``` already containes the line ```require("./styles.less");```, which is needed to include it in the script. The styles here will be automatically compiled into CSS and dynamically added to the DOM when the script fires via the [node-lessify](https://www.npmjs.org/package/node-lessify) module that Chris Wilson maintains.
+ ```package.json```: A set of instructions for Node and Browserify, including transforms that Browserify needs to correctly include LESS and CSV files in the interactive. Make sure you ran ```npm install``` after you cloned this repo, as that will automatically download these modules.
+ ```test.html```: An HTML file for previewing your app after it is compiled.
+ ```index.html```: Very similar to ```test.html```, but better replicates this Time.com environment.

## Writing an app for Time.com

**Important**: All Time.com interactives should run inside the ```.time-interactive``` selector--that is, the class automatically assigned to the parent ```<div>```. They should not be messing with the DOM outside of this element without a specific reason to do so (such as tweaking a template).

One of the reasons we use LESS for stylesheets is that it allows us to easily wrap this class around all styles specific to the interactive, thus preventing them from screwing up the styling of the page. Likewise, *all jQuery selectors should start with .time-interactive.* Otherwise, there is a risk that an ID assigned to something inside the interactive will also appear elsewhere.

By default, a new script requires the ```time-interactive``` script included in this repo, which contains some convenience functions for getting started.

It also creates a new instance of a Time.com interactive using this module's ```.make()``` method, which updates the ```<div>``` created by the short code with some useful features. After adding the necessary classes and ids, it removes the screenshot that is included on page load. 

To compile the ```debug.js``` script, run the following command in the app's directory:

	browserify debug.js > script.js --debug

To run browserify in Intellij:
    Goto IntelliJ - Preferences - External Tools - Click the plus button on the lower, left corner:
    http://screencast.com/t/rAAc50bQyWWg

To add the browserify command to a toolbar:
Goto IntelliJ - Preferences - Menus and Toolbars,Click on the arrow next to "Main Toolbar",
select the position the browserify is supposed to appear, click on "Add After" button and add the browserify
external tool action.


### time-interactive() options

+ ```headline```: The headline at the top of the interactive. Default: none
+ ```intro```: The subhead
+ ```keepscreenshot```: Do not delete the screenshot when the interactive loads. Default: false.
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

By default, this creates a new folder in the ```../../apps/development/``` folder relative to where this module lives. You can change that location in the ```bin/opts.json``` file.

## Writing an app for Time.com

When you generate a new app, it places a file called ```debug.js``` in the folder. This is your main file for all scripting. Because it will be compiling using [Browserify](https://github.com/substack/node-browserify), other Javascript files can be drawn in using the Node.js ```require()``` command. 

By default, a new script requires the ```time-interactive``` script included in this repo and ```d3```, which should be deleted if you don't need it.

It also creates a new instance of a Time.com interactive using this repo's ```.make()``` method, which updates the ```<div>``` created by the short code with some useful features. After adding the necessary classes and ids, it removes the screenshot that is included on page load. 

To compile the ```debug.js``` script...


### options

+ ```headline```: The headline at the top of the interactive. Default: none
+ ```keepscreenshot```: Do not delete the screenshot when the interactive loads. Default: false.
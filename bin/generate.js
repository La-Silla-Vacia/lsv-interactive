#!/usr/bin/env node

var fs = require("fs");
var mkdirp = require("mkdirp");
var _ = require("underscore");
var ncp = require('ncp').ncp;


try {
	var opts = fs.readFileSync("package.json", "utf8");
	opts = JSON.parse(opts);
} catch(e) {
	var opts = {};
}


if (process.argv.length < 3) {
	console.log("Please enter an id.");
	return false;
}

var data = {
		interactive_id: process.argv[2]
	},
	app_dir = process.argv[3] || opts["time-interactive"].app_dir || "./";

var index = _.template(fs.readFileSync(__dirname + "/prototype/index.html", "utf8")),
	debug = _.template(fs.readFileSync(__dirname + "/prototype/debug.js", "utf8")),
	styles = _.template(fs.readFileSync(__dirname + "/prototype/src/styles.less", "utf8")),
	pkg = _.template(fs.readFileSync(__dirname + "/prototype/package.json", "utf8"));

var path = app_dir + data.interactive_id;

mkdirp(path, function() {
	fs.writeFileSync(path + "/index.html", index(data));
	fs.writeFileSync(path + "/debug.js", debug(data));
	fs.writeFileSync(path + "/package.json", pkg(data));

	mkdirp(path + "/src", function() {
		fs.writeFileSync(path + "/src/styles.less", styles(data));

		ncp(__dirname + "/prototype/src/base.html", path + "/src/base.html", function (err) {
		 	if (err) {
		   		return console.error(err);
		 	}

		 	// test the bundling
			var browserify = require('browserify');		 

			var b = browserify();
			b.add(path + "/debug.js");
			b.bundle();		
		});
	});

	//mkdirp(path + "/data", function() {});

	ncp(__dirname + "/prototype/screenshot.png", path + "/screenshot.png", function (err) {
	 if (err) {
	   return console.error(err);
	 }
	});

	ncp(__dirname + "/prototype/.gitignore", path + "/.gitignore", function (err) {
	 if (err) {
	   return console.error(err);
	 }
	});

});
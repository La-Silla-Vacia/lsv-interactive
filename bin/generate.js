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


var app_dir = opts["time-interactive"].app_dir || "./";

if (process.argv.length < 4) {
	console.log("Please enter an id and a headline");
	return false;
}

var tst = _.template(fs.readFileSync(__dirname + "/prototype/test.html", "utf8")),
	index = _.template(fs.readFileSync(__dirname + "/prototype/index.html", "utf8")),
	debug = _.template(fs.readFileSync(__dirname + "/prototype/debug.js", "utf8")),
	styles = _.template(fs.readFileSync(__dirname + "/prototype/src/styles.less", "utf8")),
	pkg = _.template(fs.readFileSync(__dirname + "/prototype/package.json", "utf8"));

var data = {
	interactive_id: process.argv[2],
	headline: process.argv[3]
};

var path = app_dir + data.interactive_id;

mkdirp(path, function() {
	fs.writeFileSync(path + "/test.html", tst(data));
	fs.writeFileSync(path + "/index.html", index(data));
	fs.writeFileSync(path + "/debug.js", debug(data));
	fs.writeFileSync(path + "/package.json", pkg(data));

	mkdirp(path + "/src", function() {
		fs.writeFileSync(path + "/src/styles.less", styles(data));
	});

	mkdirp(path + "/data", function() {});

	ncp(__dirname + "/prototype/screenshot.png", path + "/screenshot.png", function (err) {
	 if (err) {
	   return console.error(err);
	 }
	});
});
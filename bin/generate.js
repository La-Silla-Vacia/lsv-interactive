#!/usr/bin/env node
var fs = require("fs");
var mkdirp = require("mkdirp");
var _ = require("underscore");
var ncp = require('ncp').ncp;
var exec = require('child_process').exec;

var args = require('minimist')(process.argv.slice(2));
var opts = JSON.parse(fs.readFileSync(__dirname + "/../package.json", "utf8"));

if (args.v || args.version) {
  console.log("v" + opts.version);
  return;
}

if (!args._.length) {
  console.log("Please enter a project name.");
  return false;
}

var app_dir = "./";  // default to the the current directory
if (args._.length > 1) {
  app_dir = args._[1];
  // make sure app_dir ends with a / delimiter
  if (app_dir.slice(-1) != '/') {
    app_dir += '/';
  }
}

var data = {
  interactive_id: args._[0],
  date: (new Date()).toString().split(' ').splice(1, 3).join(' '),
  version: opts.version || "*"
};


var index = _.template(fs.readFileSync(__dirname + "/../prototype/index.html", "utf8")),
  debug = _.template(fs.readFileSync(__dirname + "/../prototype/debug.js", "utf8")),
  styles = _.template(fs.readFileSync(__dirname + "/../prototype/src/base.css", "utf8")),
  baseJs = _.template(fs.readFileSync(__dirname + "/../prototype/src/base.js", "utf8")),
  globalStyles = _.template(fs.readFileSync(__dirname + "/../prototype/src/global.css", "utf8")),
  pkg = _.template(fs.readFileSync(__dirname + "/../prototype/package.json", "utf8")),
  interactiveData = _.template(fs.readFileSync(__dirname + "/../prototype/data/data.json", "utf8")),
  readme = _.template(fs.readFileSync(__dirname + "/../prototype/README.md", "utf8")),
  postcssConfig = _.template(fs.readFileSync(__dirname + "/../prototype/postcss.config.js", "utf8"));


var path = app_dir + data.interactive_id;

if (fs.existsSync(path)) {
  console.error("The path " + path + " already exists!");
  console.error("Program execution aborted!");
}

mkdirp(path, function () {
  fs.writeFileSync(path + "/index.html", index(data));
  fs.writeFileSync(path + "/debug.js", debug(data));
  fs.writeFileSync(path + "/package.json", pkg(data));
  fs.writeFileSync(path + "/README.md", readme(data));
  fs.writeFileSync(path + "/postcss.config.js", postcssConfig(data));

  mkdirp(path + "/dist", function () {
  });

  mkdirp(path + "/src", function () {
    fs.writeFileSync(path + "/src/base.css", styles(data));
    fs.writeFileSync(path + "/src/global.css", globalStyles(data));
    fs.writeFileSync(path + "/src/base.js", baseJs(data));
  });

  mkdirp(path + "/webpack", function () {
    ncp(__dirname + "/../prototype/webpack/dev.config.js", path + "/webpack/dev.config.js", function (err) {
      if (err) {
        return console.error(err);
      }
    });

    ncp(__dirname + "/../prototype/webpack/production.config.js", path + "/webpack/production.config.js", function (err) {
      if (err) {
        return console.error(err);
      }
    });
  });

  mkdirp(path + "/data", function (err) {
    fs.writeFileSync(path + "/data/data.json", interactiveData(data));
    if (err) {
      return console.error(err);
    }
  });

  ncp(__dirname + "/../prototype/gitignore", path + "/.gitignore", function (err) {
    if (err) {
      return console.error(err);
    }
  });

  ncp(__dirname + "/../prototype/screenshot.png", path + "/screenshot.png", function (err) {
    if (err) {
      return console.error(err);
    }
  });
});

var cmd = `cd ${path} && npm install`;
console.log('Succesfull created the project files.');
console.log('Now installing dependencies. This can take a couple of minutes');
console.log('You can already start editing in your favourite editor. The entry file for you is "src/base.js"');
console.log('After installing the dependencies your development server will start automatic and will open you\'re browser with a live reloading version of your project.');
exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
  if (error) throw error;
  console.log(stdout);
  console.log('Installing dependencies done! Now starting the development server');
  exec(`cd ${path} && npm start`, function(error, stdout, stderr) {
    if (error) throw error;
    console.log('Development server started! Enjoy working on the project!');
  });
});
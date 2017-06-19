#!/usr/bin/env node
var fs = require("fs");
var mkdirp = require("mkdirp");
var _ = require("underscore");
var ncp = require('ncp').ncp;
var exec = require('child_process').exec;

var prompt = require('prompt');
var colors = require("colors/safe");

var args = require('minimist')(process.argv.slice(2));
var opts = JSON.parse(fs.readFileSync(__dirname + "/../package.json", "utf8"));

if (args.v || args.version) {
  console.log("v" + opts.version);
  return;
}

var data, path, repository, dataUri;

var schema = {
  properties: {
    name: {
      pattern: /^[a-z_0-9]+$/,
      message: 'Name must be lowercase and may not contain, spaces, numbers or normal dashes. Use _ instead.',
      required: true,
      description: colors.cyan("What is the interactive name?")
    },
    spreadsheet: {
      message: `${colors.cyan("Do you want to use a Spreadsheet as database?")} ${colors.yellow('yes/no')}`,
      validator: /y[es]*|n[o]?/,
      warning: 'Must respond yes or no',
      default: 'yes'
    },
    spreadsheetStep1: {
      hidden: true,
      description: `${colors.cyan("Please duplicate this Spreadsheet: \n")} 
        ${colors.yellow("https://docs.google.com/a/lasillavacia.com/spreadsheets/d/13WYkypDJzDr1ebez-itfUYq-0ICw0HD7qOj9YBRcvlc/edit?usp=sharing \n")} 
        ${colors.red.italic("Press enter if you did it")}`,
      ask: function () {
        // only ask for proxy credentials if a proxy was set
        return prompt.history('spreadsheet').value === 'yes';
      }
    },
    spreadsheetStep2: {
      hidden: true,
      description: `1. ${colors.cyan("In the new Spreadsheet go to the 'Settings' tab")}
        2. ${colors.cyan("Replace behind interactive name the word 'my_interactive_name' to the exact name as the interactive")}
        3. ${colors.red.italic("Press enter if you did it")}`,
      ask: function () {
        // only ask for proxy credentials if a proxy was set
        return prompt.history('spreadsheet').value === 'yes';
      }
    },
    spreadsheetStep3: {
      hidden: true,
      description:
        `1. ${colors.cyan("Click in the top bar 'Export to production' and then 'Publish'")}
        2. ${colors.cyan("Select your account and authenticate, this only needs the first time")}
        3. ${colors.cyan("If you don't get an error, the database is published")}
        4. ${colors.red.italic("Press enter if you did it")}`,
      ask: function () {
        // only ask for proxy credentials if a proxy was set
        return prompt.history('spreadsheet').value === 'yes';
      }
    },
    haveRepository: {
      message: `${colors.cyan("Have you already created a GitHub repository?")} ${colors.yellow('yes/no')}`,
      validator: /y[es]*|n[o]?/,
      warning: 'Must respond yes or no',
      default: 'no'
    },
    repository: {
      type: 'string',
      description: `${colors.cyan("What is the repository origin?")}`,
      ask: function () {
        // only ask for proxy credentials if a proxy was set
        return prompt.history('haveRepository').value === 'yes';
      }
    },
    wantRepository: {
      message: `${colors.cyan("Do you want to create a repository?")} ${colors.yellow('yes/no')}`,
      validator: /y[es]*|n[o]?/,
      warning: 'Must respond yes or no',
      default: 'yes',
      ask: function () {
        // only ask for proxy credentials if a proxy was set
        return prompt.history('haveRepository').value === 'no';
      }
    },
    createRepository: {
      description: `1. ${colors.cyan("Go to the the La Silla Vacía organisation on GitHub")}
        2. ${colors.cyan("Create a new repository with the exact same name as the interactive")}
        3. ${colors.red.italic("Press enter if you did it")}`,
      ask: function () {
        // only ask for proxy credentials if a proxy was set
        return prompt.history('wantRepository').value === 'yes';
      }
    }
  }
};

//
// Start the prompt
//
prompt.start();

//
// Get two properties from the user: email, password
//
prompt.get(schema, function (err, result) {
  //
  // Log the results.
  //
  if (err) {
    console.log('Looks like you canceled. Have a nice day.');
    return;
  }

  console.log(colors.yellow("Great! We're now creating all the files for\n"));
  console.log('Name: ' + result.name + "\n\n");

  if (result.repository) {
    repository = result.repository;
  } else if (result.wantRepository === 'yes') {
    repository = `https://github.com/La-Silla-Vacia/${result.name}.git`;
  }

  if (result.spreadsheet === 'yes') {
    dataUri = `https://lsv-data-visualizations.firebaseio.com/${result.name}.json`;
  } else {
    dataUri = "data/data.json";
  }

  data = {
    interactive_id: result.name,
    dataUri: dataUri,
    repository: repository,
    date: (new Date()).toString().split(' ').splice(1, 3).join(' '),
    version: opts.version || "*",
  };
  path = app_dir + data.interactive_id;
  create();
});


var app_dir = "./";  // default to the the current directory
if (args._.length > 1) {
  app_dir = args._[1];
  // make sure app_dir ends with a / delimiter
  if (app_dir.slice(-1) != '/') {
    app_dir += '/';
  }
}


var index = _.template(fs.readFileSync(__dirname + "/../prototype/index.html", "utf8")),
  debug = _.template(fs.readFileSync(__dirname + "/../prototype/debug.js", "utf8")),
  styles = _.template(fs.readFileSync(__dirname + "/../prototype/src/base.css", "utf8")),
  baseJs = _.template(fs.readFileSync(__dirname + "/../prototype/src/base.jsx", "utf8")),
  globalStyles = _.template(fs.readFileSync(__dirname + "/../prototype/src/global.css", "utf8")),
  pkg = _.template(fs.readFileSync(__dirname + "/../prototype/package.json", "utf8")),
  interactiveData = _.template(fs.readFileSync(__dirname + "/../prototype/data/data.json", "utf8")),
  readme = _.template(fs.readFileSync(__dirname + "/../prototype/README.md", "utf8")),
  postcssConfig = _.template(fs.readFileSync(__dirname + "/../prototype/postcss.config.js", "utf8")),
  getDataScript = _.template(fs.readFileSync(__dirname + "/../prototype/src/Scripts/getData.js", "utf8"));


function create() {
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
      fs.closeSync(fs.openSync(path + "/dist/.gitkeep", 'w'));
    });

    mkdirp(path + "/src", function () {
      fs.writeFileSync(path + "/src/base.css", styles(data));
      fs.writeFileSync(path + "/src/global.css", globalStyles(data));
      fs.writeFileSync(path + "/src/base.jsx", baseJs(data));
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

    mkdirp(path + "/src/Components", function() {
      ncp(__dirname + "/../prototype/src/Components/", path + "/src/Components");
    });

    mkdirp(path + "/src/Scripts", function() {
      fs.writeFileSync(path + "/src/Scripts/getData.js", getDataScript(data));
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

  var cmd = `cd ${path} && yarn install`;
  console.log(colors.yellow("Succesfull created the project files."));
  console.log(colors.yellow("Now installing dependencies. This can take a couple of minutes"));
  console.log(colors.yellow("You can already start editing in your favourite editor. The entry file for you is \"src/base.jsx\""));
  console.log('After installing the dependencies your development server will start automatic and will open you\'re ' +
    'browser with a live reloading version of your project.');

  if (repository) {
    console.log('- Now creating the initial commit and pushing to the repository');
    exec(`cd ${path} && git init && git remote add origin ${repository} && git add -A && git commit -m 'Initial commit from lsv-interactive' && git push --set-upstream origin master`);
  }

  exec(cmd, function (error, stdout, stderr) {
    // command output is in stdout
    if (error) throw error;
    console.log(stdout);
    console.log('Installing dependencies done! Now starting the development server.');
    console.log('To stop the server, press \'ctrl+c\'');
    exec(`cd ${path} && yarn start`, function (error, stdout, stderr) {
      if (error) throw error;
      console.log('Development server started! Enjoy working on the project!');
    });
  });
}
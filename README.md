Guide to Time.com Interactives
====

[![Build Status](https://travis-ci.org/TimeMagazine/time-interactive.png)](https://travis-ci.org/TimeMagazine/time-interactive) 
[![Dependency Status](https://david-dm.org/TimeMagazine/time-interactive.svg)](https://david-dm.org/TimeMagazine/time-interactive)

v0.2.8

Our interactives at Time are developed independently from the CMS and bundled into self-assembling Javascript files using [browserify](https://www.npmjs.org/package/browserify). They are both discrete--requiring no dependencies--and discreet--interfering as little as possible with the rest of the page. 

This repository provides both a [command-line script](https://github.com/TimeMagazine/time-interactive/blob/master/bin/generate.js) for generating new projects and a [client-side script](https://github.com/TimeMagazine/time-interactive/blob/master/index.js) with a few convenience functions.

Please see the [wiki](https://github.com/TimeMagazine/time-interactive/wiki) for instructions on installation and usage. 

## Update log
+ **v0.2.9**: Removed unneeded trigger from index.js and fixed up prototype a bit. Added iframe version.
+ **v0.2.8**: Updated package dependency
+ **v0.2.7**: Fixed echo in npm scripts
+ **v0.2.6**: Added some more npm commands
+ **v0.2.5**: Simplified the execution of the interactive
+ **v0.2.4**: Nixed `_$` and moved the CSS require to outside the callback
+ **v0.2.3**: Added a `minimal` upload option
+ **v0.2.2**: Updated dependencies
+ **v0.2.1**: Restored `browserify` since `npm run` appears to look for a local copy, and added two new scripts: `dryrun` and `stage`
+ **v0.2.0**: Removed `browserify` from prototype `package.json`
+ **v0.1.9c**: Cleaned up the prototype `package.json`
+ **v0.1.9b**: Moved most of README to wiki and added shortcut scripts to default `package.json`
+ **v0.1.9a**: Prevent script from running twice (thx @arlandi !)
+ **v0.1.9**: Code now includes DOM check
+ **v0.1.4**: Fixed version problem
+ **v0.1.2**: Institutionalized the DOM check in `index.js`
+ **v0.1.1**: Added check to see if DOM has loaded.
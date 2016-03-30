Guide to Time.com Interactives
====

[![Build Status](https://travis-ci.org/TimeMagazine/time-interactive.png)](https://travis-ci.org/TimeMagazine/time-interactive) [![Dependency Status](https://david-dm.org/TimeMagazine/time-interactive.svg)](https://david-dm.org/TimeMagazine/time-interactive)

v0.1.9b

Our interactives at Time are developed independently from the CMS and bundled into self-assembling Javascript files using [browserify](https://www.npmjs.org/package/browserify). They are both discrete--requiring no dependencies--and discreet--interfering as little as possible with the rest of the page. 

This repository provides both a [command-line script](/bin/generate.js) for generating new projects and a [client-side script](/index.js) with a few convenience functions.

Please see the [wiki](/wiki) for instructions on installation and usage. 

## Update log
+ **v0.1.9b**: Moved most of README to wiki and added shortcut scripts to default `package.json`
+ **v0.1.9a**: Prevent script from running twice (thx @arlandi !)
+ **v0.1.9**: Code now includes DOM check
+ **v0.1.4**: Fixed version problem
+ **v0.1.2**: Institutionalized the DOM check in `index.js`
+ **v0.1.1**: Added check to see if DOM has loaded.
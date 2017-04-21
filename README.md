Guide to LaSillaVacia.com Interactives
====

// This is a customized fork from github.com/TimeMagazine/time-interactive

Our interactives at La Silla Vacia are developed independently from the CMS and bundled into self-assembling Javascript files using [webpack](https://webpack.github.io/). They are both discrete--requiring no dependencies--and discreet--interfering as little as possible with the rest of the page. 

The use of webpack loader, including [babel](https://babeljs.io/), allows developers to include all the (reasonably-sized) files they need in `debug.js`: HTML, CSS, PostCSS, and any modern Javascript conventions.

The templating is done with [Preact.js](https://preactjs.com/). A lightweight React alternative.

Please see the [wiki](https://github.com/La-Silla-Vacia/lsv-interactive/wiki) for instructions on installation and usage. 
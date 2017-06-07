/*global require,console*/

var lsv = require('lsv-interactive');
import { h, render } from 'preact';
import Base from './src/base.jsx';

require("./src/base.css"); // this goes outside the callback since otherwise the interactive sometimes fires before the CSS is fully loaded
require("./src/global.css");

lsv("<%= interactive_id %>", function (interactive) {
  "use strict";

  if (!interactive) {
    console.log("Interactive <%= interactive_id %> not initiated. Exiting.");
    return;
  }

  //MARKUP
  render((
    <Base {...interactive} />
  ), interactive.el);

}, true); // change this last param to true if you want to skip the DOM checks
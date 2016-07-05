import * as d3 from 'd3';
import greeter from './greeter';
import $ = require('jquery');
import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';

$(() => {
  $(document.body).html(greeter('World'));

  var body = d3.select('body');
  var div = body.append('div');
  div.html('Hello, d3js');
});
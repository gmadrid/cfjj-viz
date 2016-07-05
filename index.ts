import * as d3 from 'd3';
import greeter from './greeter';
import $ = require('jquery');

$(() => {
  $(document.body).html(greeter('World'));

  var body = d3.select('body');
  var div = body.append('div');
  div.html('Hello, d3js');
});
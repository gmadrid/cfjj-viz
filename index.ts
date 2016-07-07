import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, h, svg, div, input, p} from '@cycle/dom';

import * as d3 from 'd3';
import {makeD3Driver} from './d3driver';

function foobar(selector: string, data: any) {
  console.log("INPUT: " + JSON.stringify(data));
  let root = d3.select(selector)

  let color = d3.scaleOrdinal(d3.schemeCategory10);

  root.style('background', 'green')
            .attr('width', 500)
            .attr('height', 350);
  let circles = root.selectAll('circle') 
      .data(data);

  circles.enter()
      .append('circle')
      .attr('r', (d, i) => { console.log('renter:' + i); return <number>d; })
      .attr('cx', (d, i) => { return 75 + i * 25 })
      .attr('cy', 80)

  circles.attr('r', (d, i) => { console.log('r:' + i); return <number>d; })
      .attr('fill', (d, i) => { console.log('fill:' + i); return color(i); });

  circles.exit().remove();
}

function main(sources) {
  let thing = sources.DOM.select('#d3input').events('keyup')
    .map(ev => { 
            return ev.target.value.split(',').map(s => { return parseFloat(s) || null; }).filter(num => { return num != null });
    })
    .startWith([]);
  const sinks = {
    DOM: xs.of(div([
      div([input('#d3input')]),
      div([
        h('svg#d3svg')
      ])])),
    D3: thing
  };
  return sinks;
}

const drivers: {[name: string]: Function} = {
  DOM: makeDOMDriver('#app'),
  D3: makeD3Driver('#d3svg', foobar)
}

run(main, drivers);

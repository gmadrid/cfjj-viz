import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, h, svg, div, input, p} from '@cycle/dom';
import * as d3 from 'd3';

import {generateRandomData} from './datagen'; 
import {makeD3Driver} from './d3driver';

function foobar(selector: string, data: any) {
  console.log(JSON.stringify(data));
  let root = d3.select(selector)

  let color = d3.scaleOrdinal(d3.schemeCategory10);

  root.attr('width', 500)
      .attr('height', 350);

  let circles = root.selectAll('circle') 
      .data(data);

  circles.enter()
      .append('circle')
      .attr('r', 0)
      .attr('cx', (d, i) => { return 75 + i * 25 })
      .attr('cy', 80)
    .merge(circles)
      .attr('fill', (d, i) => { return color(i); })
      .transition(250)
        .attr('r', (d, i) => { return <number>d; })

  circles.exit().remove();
}

const buttonName = '#randomButton'

function main(sources) {
  let data$ = sources.DOM.select(buttonName).events('click')
    .mapTo(generateRandomData());

  const sinks = {
    DOM: xs.of(div([
      div([input(buttonName, {attrs: {type:'button', value: 'Generate random data'}})]),
      div([
        h('svg#d3svg')
      ])])),
    D3: data$
  };
  return sinks;
}

const drivers: {[name: string]: Function} = {
  DOM: makeDOMDriver('#app'),
  D3: makeD3Driver('#d3svg', foobar)
}

run(main, drivers);

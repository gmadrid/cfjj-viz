import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, h, svg, div, input, p} from '@cycle/dom';

import {generateRandomData} from './datagen'; 
import {makeD3Driver} from './d3driver';
import {GenerateD3Chart} from './d3chart';

const buttonName = '#randomButton'

function main(sources) {
  let data$ = sources.DOM.select(buttonName).events('click')
    .map(_ => { return generateRandomData(); })
    .startWith(generateRandomData());

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
  D3: makeD3Driver('#d3svg', GenerateD3Chart)
}

run(main, drivers);

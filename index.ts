import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, h, svg, div, input, p} from '@cycle/dom';

import {generateRandomData} from './datagen'; 
import {makeD3Driver} from './d3driver';
import {GenerateD3Chart} from './d3chart';

const buttonName = '#randomButton'

function intent(sources) {
  let generateData$ = sources.DOM.select(buttonName).events('click').startWith(1);
  return {
    generateData$: generateData$
  }
}

function model(intent) {
  let data$ = intent.generateData$
    .map(_ => { return generateRandomData(); });
    
  return {
    data$: data$
  }
}

function htmlView(_) {
  return xs.of(div([
      div([input(buttonName, {attrs: {type:'button', value: 'Generate random data'}})]),
      div([
        h('svg#d3svg')
      ])]));
}

function d3View(m) {
  return m.data$;
}

function main(sources) {
  let i = intent(sources);
  let m = model(i);

  const sinks = {
    DOM: htmlView(m),
    D3: d3View(m)
  };
  return sinks;
}

const drivers: {[name: string]: Function} = {
  DOM: makeDOMDriver('#app'),
  D3: makeD3Driver('#d3svg', GenerateD3Chart)
}

run(main, drivers);

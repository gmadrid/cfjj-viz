import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, h, svg, div, form, input, p} from '@cycle/dom';
import * as d3 from 'd3';

import {GenerateRandomData, VisData, VisDatum, CategoryNames} from './datagen'; 
import {GenerateD3Chart} from './d3chart';
import {makeD3Driver} from './d3driver';

type Intent = {
  // Message that the categories in the control form have changed.
  changeCategories$: xs<any>,

  // Stream with the data we display.
  generateData$: xs<VisData>
}

type State = {
  categories: Array<string>,
  selectedCategories: Array<[string, string]>
}

type Model = {
  data$: xs<VisData>,
  state$: xs<State>
}

const popupClass = '.categoryPopup'
const buttonName = '#randomButton'

function intent(sources): Intent {
  return {
    changeCategories$: sources.DOM.select(popupClass).events('change'),
    generateData$: sources.DOM.select(buttonName).events('click')
  }
}

function model(intent): Model {
  let data$ = intent.generateData$.startWith(null)
    .map(_ => { return GenerateRandomData(); });

  let state$ = xs.combine(data$, intent.changeCategories$.startWith(null))
    .map(c => {
      console.log("foobarrrrr");
      let [data, changeEvent] = c;
      return {
        categories: CategoryNames,
        selectedCategories: []
      };
    });

  return {
    state$: state$,
    data$: data$
  }
}

function selectForArray(name: string, optionStrings: Array<string>, lowIndex: number, highIndex: number, selectedIndex: number) {
  let options = [h('option', { attrs: {value: '' } })];

  d3.range(lowIndex, highIndex).forEach(i => {
    let optionString = optionStrings[i];
    options.push(h('option', { attrs: {value: optionString, selected: i == selectedIndex } }, optionString));
  });

  var select = h('select' + popupClass, options);

  return select;
}

function control(state: State) {
  let foo = selectForArray('foobar', state.categories, 0, state.categories.length, -1);

  return div([
    h('form', { attrs: { id: 'controlForm'} }, [foo])
    ]);
}

function htmlView(model: Model): xs<any> {
  return model.state$.map(s => {
    return div([
      div([input(buttonName, {attrs: {type:'button', value: 'Generate random data'}})]),
      control(s),
      div([
        h('svg#d3svg')
      ])
    ])
  });
//  return xs.of(h('h3', 'Hi there.'));
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

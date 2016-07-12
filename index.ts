import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { makeDOMDriver } from '@cycle/dom';

import { generateRandomData, VisData } from './datagen'; 
import { d3View, generateD3Chart } from './d3chart';
import { makeD3Driver } from './d3driver';
import { CategoryPopupClassName, htmlView, RandomButtonName } from './htmlview';
import { Model } from './model';
import { buildState, State } from './state';

type Intent = {
  // Message that the categories in the control form have changed.
  changeCategories$: xs<any>,

  // Stream with the data we display.
  generateData$: xs<VisData>
}

function intent(sources): Intent {
  return {
    changeCategories$: sources.DOM.select(CategoryPopupClassName).events('change'),
    generateData$: sources.DOM.select(RandomButtonName).events('click')
  }
}

function model(intent): Model {
  let data$ = intent.generateData$.startWith(null)
    .map(_ => { return generateRandomData(); })
    .remember();

  let state$: xs<State> = xs.combine(data$, intent.changeCategories$.startWith(null))
    .map(buildState)
    .remember();
/*    .map(c => {
      let [data, changeEvent] = c;
      return {
        categories: CategoryNames,
        selectedCategories: [<[string, string]>[CategoryNames[0], "bamsoo"]]
      };
    })
    .remember();*/

  return {
    state$: state$,
    data$: data$
  }
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
  D3: makeD3Driver('#d3svg', generateD3Chart)
}

run(main, drivers);

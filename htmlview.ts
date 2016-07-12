import { h, svg, div, form, input, p } from '@cycle/dom';
import * as d3 from 'd3';
import xs from 'xstream';

import { Model } from './model';
import { State } from './state';

export const CategoryPopupClassName = '.categoryPopup'
export const RandomButtonName = '#randomButton'

function selectForArray(name: string, optionStrings: string[], lowIndex: number, highIndex: number, selectedIndex: number) {
  let options = [h('option', { attrs: {value: '' } })];

  d3.range(lowIndex, highIndex).forEach(i => {
    let optionString = optionStrings[i];
    options.push(h('option', { attrs: {value: optionString, selected: i == selectedIndex } }, optionString));
  });

  var select = h('select' + CategoryPopupClassName, options);

  return select;
}

function control(state: State) {
  let foo = selectForArray('foobar', state.categories, 0, state.categories.length, -1);

  return div([
    h('form', { attrs: { id: 'controlForm'} }, [foo])
    ]);
}

export function htmlView(model: Model): xs<any> {
  return model.state$.map(s => {
    return div([
//      div([input(RandomButtonName, {attrs: {type:'button', value: 'Generate random data'}})]),
      control(s),
      div([
        h('svg#d3svg')
      ])
    ])
  });
}

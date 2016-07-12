import { h, svg, div, form, input, p } from '@cycle/dom';
import * as d3 from 'd3';
import xs from 'xstream';

import { Model } from './model';
import { State } from './state';

export const CategoryPopupClassName = '.categoryPopup'
export const RandomButtonName = '#randomButton'

function selectForArray(name: string, optionStrings: string[], lowIndex: number, highIndex: number, selectedValue: string, addBlank: boolean) {
  let options = [];
  if (addBlank) {
    options.push(h('option', { attrs: {value: '', selected: selectedValue == null } }));
  }

  d3.range(lowIndex, highIndex).forEach(i => {
    let optionString = optionStrings[i];
    options.push(h('option', { attrs: {value: optionString, selected: optionString == selectedValue } }, optionString));
  });

  var select = h('select' + CategoryPopupClassName, options);

  return select;
}

function control(state: State) {
  // Build a selector for each chosen category. 
  // The first category will always have some choice, but the others will default to blank (unchosen).
  let unchosenCategories = new Set(state.categories);
  let stop = false;
  let selects = [];
  state.selectedCategories.forEach(pair => {
    if (stop) return;

    let [categoryName, categoryValue] = pair;
    if (!unchosenCategories.has(categoryName)) {
      stop = true;
    } else {
      selects.push(selectForArray('', 
        Array.from(unchosenCategories.values()), 
        0, 
        unchosenCategories.size, 
        categoryName, 
        selects.length > 0));
      selects.push(h('br');
      unchosenCategories.delete(categoryName);
    }
  });
  if (unchosenCategories.size > 0) {
    selects.push(selectForArray('', Array.from(unchosenCategories.values()), 0, unchosenCategories.size, null, true));
  }

  let foo = selectForArray('foobar', state.categories, 0, state.categories.length, state.selectedCategories[0][0], false);

  return div([
    h('form', { attrs: { id: 'controlForm'} }, selects)
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

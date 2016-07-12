import xs from 'xstream';

import { VisData } from './datagen';
import { State } from './state';

export type Model = {
  data$: xs<VisData>,
  state$: xs<State>
}

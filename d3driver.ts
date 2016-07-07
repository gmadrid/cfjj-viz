//import {select} from 'd3';
import xs from 'xstream';

// TODO: make this function spec more specific.
export function makeD3Driver(selector: string, f: Function) {
  return function D3Driver(outgoing$) {
    outgoing$.addListener({
      next: outgoing => { f(selector, outgoing); },
      error: () => {},
      complete: () => {}
    });

    return xs.create({
      start: listener => {},
      stop: () => {}
    });
  }
}

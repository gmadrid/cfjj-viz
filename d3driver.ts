//import {select} from 'd3';
import xs from 'xstream';

// TODO: make this function spec more specific.
export function makeD3Driver(selector: string, f: Function) {
  return function D3Driver(outgoing$) {
    outgoing$.addListener({
      next: outgoing => { f(selector, outgoing); },
/*        select(selector).style('background', 'green')
            .attr('width', 500)
            .attr('height', 350)
          .append('circle')
            .attr('r', 30)
            .attr('cx', 75)
            .attr('cy', 80)
            .attr('fill', 'red');
      },*/
      error: () => {},
      complete: () => {}
    });

    return xs.create({
      start: listener => {},
      stop: () => {}
    });
  }
}

import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, div, input, p} from '@cycle/dom';

function makeD3Driver() {
  console.log("making");
  return function D3Driver(outgoing$) {
    outgoing$.addListener({
      next: outgoing => {
        console.log(outgoing);
      },
      error: () => {},
      complete: () => {}
    });

    return xs.create({
      start: listener => {},
      stop: () => {}
    });
  }
}

function main(sources) {
  const sinks = {
    DOM: xs.of(div('#d3div')),
    D3: xs.of('foobar')
/*    DOM: sources.DOM.select('input').events('click')
        .map(ev => ev.target.checked)
        .startWith(false)
        .map(toggled => div([
          input({attrs: {type: 'checkbox'}}), 'Toggle me',
          p(toggled ? 'ON' : 'off')
          ]))*/
  };
  return sinks;
}

const drivers: {[name: string]: Function} = {
  DOM: makeDOMDriver('#app'),
  D3: makeD3Driver()
}

run(main, drivers);

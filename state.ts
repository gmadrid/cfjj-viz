import { CategoryNames, VisData } from "./datagen";

export type State = {
  categories: string[],
  selectedCategories: [string, string][]
}

function stringPair(a: string, b: string) {
  return <[string, string]>[a, b];
}

export function buildState(combinedStreams: [VisData, any]) {
  let [data, ev] = combinedStreams;

  let categories: [string,string][] = [];
  if (ev && ev.target) {
    // We assume that form is a <form> element.
    let form = ev.target.parentNode;

    let stop = false;
    let categoriesSeen = new Set();
    let selects = form.querySelectorAll('select');
    Array.prototype.forEach.call(selects, select => {
      if (!stop && select.value.length > 0) {
        if (categoriesSeen.has(select.value)) {
          // Once we see a dup, we are done.
          stop = true;
        } else {
          categories.push(stringPair(select.value, null));
          categoriesSeen.add(select.value);
        }
      }
    });
  }

  if (categories.length == 0) {
    categories.push(stringPair(CategoryNames[1], null));
  }

  return {
    categories: CategoryNames,
    selectedCategories: categories
  };
}

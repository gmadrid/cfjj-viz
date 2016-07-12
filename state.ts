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

  let categoryName = CategoryNames[0];
  if (ev && ev.target && ev.target.value && ev.target.value.length != 0) {
    categoryName = ev.target.value;
  }

  return {
    categories: CategoryNames,
    selectedCategories: [stringPair(categoryName, null)]
  };
}

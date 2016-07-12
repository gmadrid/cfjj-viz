import * as d3 from 'd3';
import xs from 'xstream';

import { VisData } from './datagen';
import { State } from './state';

const RootFakeKey = '==r00t==';

export function d3View(m) {
  return xs.combine(m.data$, m.state$);
}

function sliceNDice(arr: any, keys: string[]) {
  return partitionChildren(null, arr, '', keys, -1)[0];

  function arrayForKey(map, key) {
    let result = map.get(key);
    if (!result) {
      result = [];
      map.set(key, result);
    }
    return result;
  }

  function currentKeyValue(currObj, keys, currKeyIndex) {
    if (currKeyIndex < 0) return RootFakeKey;
    return currObj[keys[currKeyIndex]];
  }

  function partitionChildren(parent, children, lastIdValue, keys, currKeyIndex) {
    if (currKeyIndex >= keys.length) { 
      children.forEach(c => { c.parent = parent; });
      return children; 
    }

    let keyMap = d3.map();
    children.forEach(c => {
      let currKeyValue = currentKeyValue(c, keys, currKeyIndex);
      let currKeyArray = arrayForKey(keyMap, currKeyValue);
      currKeyArray.push(c);
    });

    let newNodes = [];
    keyMap.each((v,k) => {
      let newIdValue = lastIdValue + k;
      let newInnerNode = { 
        id: newIdValue,
        keyValue: k,
        parent: parent, 
        children: null };
      newInnerNode.children = partitionChildren(newInnerNode, v, newIdValue, keys, currKeyIndex + 1);
      newNodes.push(newInnerNode);
    });
    return newNodes;
  }
}

export function generateD3Chart(selector, tpl: [VisData, State]) {
  let [data, state] = tpl;

  // Configuration
  let animationDuration = 350;
  let keyArray: string[] = state.selectedCategories.map(c => { return c[0].toLowerCase(); });
  let width = 600;
  let height = 600;
  let padding = 5;

  let h = sliceNDice(data, keyArray);
  let cfjjColor = d3.scaleLinear()
    .domain([0, keyArray.length])
    .range(['#24567e', '#75c7f0']);

  let root = d3.select(selector)
      .attr('width', width)
      .attr('height', height);
  let halfWidth = width / 2;
  let halfHeight = height / 2;

  let rootNode = d3.hierarchy(h);
  rootNode.sum(d => { return d.number; });
  rootNode.sort((d1, d2) => { return d2.value - d1.value; });

  let pack = d3.pack()
      .padding(padding)
      .size([width - padding - 1, height - padding - 1]);
  let foo = pack(rootNode);

  let descendants = rootNode.descendants();
  let nodeS = root.selectAll('circle')
      .data(descendants.filter(n => { return n.depth <= keyArray.length; }),
        node => { return node.data.id; });

  nodeS.enter()
    .append('circle')
      .attr('fill', n => { return cfjjColor(n.depth); })
      .attr('cx', halfWidth)
      .attr('cy', halfHeight)
      .attr('r', 0)
    .merge(nodeS)
    .transition().duration(animationDuration)
      .attr('cx', d => { return d.x; })
      .attr('cy', d => { return d.y; })
      .attr('r', d => { return d.r; });

  nodeS.exit()
    .transition().duration(animationDuration)
      .attr('cx', halfWidth)
      .attr('cy', halfHeight)
      .attr('r', 0)
      .remove();

  let textS = root.selectAll('text')
      .data(descendants.filter(n => { return n.depth == keyArray.length; }),
        node => { return node.data.id; });

  textS.enter()
    .append('text')
      .attr('x', halfWidth)
      .attr('y', halfHeight)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('font-family', 'sans-serif')
      .attr('opacity', 0.0)
      .html(d => {
        return d.data.keyValue;
      })
    .merge(textS).transition().duration(animationDuration)
      .attr('x', d => { return d.x; })
      .attr('y', d => { return d.y; })
      .attr('opacity', 1.0);

  textS.exit().transition().duration(animationDuration)
      .attr('x', halfWidth)
      .attr('y', halfHeight)
      .attr('opacity', 0.0)
      .remove();
}

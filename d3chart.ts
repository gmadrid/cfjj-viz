import * as d3 from 'd3';

const RootFakeKey = '==r00t==';

function SliceNDice(arr: any, keys: [string]) {
  return PartitionChildren(null, arr, '', keys, -1)[0];

  function ArrayForKey(map, key) {
    let result = map.get(key);
    if (!result) {
      result = [];
      map.set(key, result);
    }
    return result;
  }

  function CurrentKeyValue(currObj, keys, currKeyIndex) {
    if (currKeyIndex < 0) return RootFakeKey;
    return currObj[keys[currKeyIndex]];
  }

  function PartitionChildren(parent, children, lastIdValue, keys, currKeyIndex) {
    if (currKeyIndex >= keys.length) { 
      children.forEach(c => { c.parent = parent; });
      return children; 
    }

    let keyMap = d3.map();
    children.forEach(c => {
      let currKeyValue = CurrentKeyValue(c, keys, currKeyIndex);
      let currKeyArray = ArrayForKey(keyMap, currKeyValue);
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
      newInnerNode.children = PartitionChildren(newInnerNode, v, newIdValue, keys, currKeyIndex + 1);
      newNodes.push(newInnerNode);
    });
    return newNodes;
  }
}

let color = d3.scaleOrdinal(d3.schemeCategory20);

export function GenerateD3Chart(selector, data) {
  // Configuration
  let animationDuration = 350;
  let keyArray: [string] = ['stage', 'race'];
  let width = 600;
  let height = 600;
  let padding = 5;

  let h = SliceNDice(data, keyArray);

  let root = d3.select(selector)
      .attr('width', width)
      .attr('height', height);
  let halfWidth = width / 2;
  let halfHeight = height / 2;

  // WARNING: Mutating input!!! Fix this.
  data.push({id: '==r00t=='});

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
      .attr('fill', n => { return color(n.depth); })
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

import * as d3 from 'd3';
import * as d3hierarchy from 'd3-hierarchy'; 

function SliceNDice(root: any, arr: any, keys: [string]) {
	root.children = arr;
}

let color = d3.scaleOrdinal(d3.schemeCategory20);

export function GenerateD3Chart(selector, data) {
//  SliceNDice(rootObj, data, ['foo']);

  let root = d3.select(selector)
      .attr('width', 600)
      .attr('height', 600);

  // WARNING: Mutating input!!! Fix this.
  data.push({id: '==r00t=='});

  let rootNode = d3.stratify()
      .parentId(d => { if (d.id == '==r00t==') { return '' } else {return '==r00t=='}})
      (data);
  rootNode.sum(d => { return d.number; });
  rootNode.sort((d1, d2) => { return d2.value - d1.value; });

  let pack = d3.pack()
      .padding(5)
      .size([594, 594]);
  let foo = pack(rootNode);

  let nodeS = root.selectAll('circle')
      .data(rootNode.descendants());

  let nodeE = nodeS.enter()
    .append('circle')
      .attr('fill', d => { return color(d.id); })
      .attr('cx', 300)
      .attr('cy', 300)
      .attr('r', 0)
    .merge(nodeS);

  nodeS.transition(250)
      .attr('cx', d => { return d.x; })
      .attr('cy', d => { return d.y; })
      .attr('r', d => { return d.r; });

  let nodeX = nodeS.exit().remove();
}
import * as d3 from 'd3';

export function GenerateD3Chart(selector, data) {
  let root = d3.select(selector)

  let color = d3.scaleOrdinal(d3.schemeCategory10);

  root.attr('width', 500)
      .attr('height', 350);

  let circles = root.selectAll('circle') 
      .data(data);

  circles.enter()
      .append('circle')
      .attr('r', 0)
      .attr('cx', (d, i) => { return 75 + i * 25 })
      .attr('cy', 80)
    .merge(circles)
      .attr('fill', (d, i) => { return color(i); })
      .transition(250)
        .attr('r', (d, i) => { return d.cost / 10; })

  circles.exit().remove();

}
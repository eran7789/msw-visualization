import React, { Component } from 'react';
import { select as d3Select, selectAll as d3SelectAll } from 'd3';
import { isEmpty } from 'lodash/fp';
import moment from 'moment';

class BarChart extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.bars !== this.props.bars && !isEmpty(this.props.bars)) {
      const { axisLeft, axisBottom, xScale } = this.props;

      d3Select('#axisLeft').call(axisLeft);
      d3Select('#axisBottom')
        .call(axisBottom)
        .selectAll(".tick text")
        .call(this.wrap, 4);
    }
  }

  wrap(textNodes, width) {
    textNodes.each(function() {
      const text = d3Select(this);
      const words = text.text().split(/\s+/).reverse();
      let word = null;
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.1; // em;
      const y = text.attr("y");
      const dy = parseFloat(text.attr("dy"));
      let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

  onMouseEnter = event => {
    const element = event.target;
    const group = element.parentNode;
    const groupDimensions = group.getBBox();

    element.setAttribute('stroke', 'black');
    element.setAttribute('stroke-width', '0.5');
    group.setAttribute('transform', `scale(1 2) translate(0 -${(groupDimensions.y + groupDimensions.height) / 2})`);
  }

  onMouseLeave = event => {
    const element = event.target;
    const group = element.parentNode;
    
    element.setAttribute('stroke', '');
    group.setAttribute('transform', ``);
  }

  render() {
    const { 
      height, 
      width, 
      title, 
      viewBox,
      bars,
      margin,
      yScale
    } = this.props;

    if (isEmpty(bars)) {
      return null;
    }

    return (
      <svg 
        height="100%"
        width="100%"
        viewBox={viewBox}>
        <text transform={`translate(${width / 2 - 30}, -60)`}>{title}</text>
        <g>
          {bars.map((bar, index) => {
            let text = null;
            let lineUp = null;

            if (index % 3 === 1) {
              text = (
                <text fontSize={10} x={bar.x + 5} y={bar.y - 10}>
                  {yScale.invert(bar.y).toFixed(2)}
                </text>
              );
            }

            if (index % 3 === 0 && index !== 0) {
              lineUp = (
                <line 
                  x1={bar.x - ((bar.x - bars[index - 1].x - bars[index - 1].width) / 2)} 
                  y0={margin.top} 
                  x2={bar.x - ((bar.x - bars[index - 1].x - bars[index - 1].width) / 2)} 
                  y2={height - margin.bottom + margin.top + 17} 
                  stroke="black" />
              );
            }

            return (
              <React.Fragment key={bar.x}>
                {lineUp}
                <g className="bar">
                  {text}
                  <rect
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    x={bar.x}
                    y={bar.y} 
                    height={bar.height} 
                    width={bar.width} 
                    fill={bar.fill || 'blue'} />
                </g>
              </React.Fragment>
            );
          })}
        </g>
        <g id="axisLeft" transform={`translate(${margin.left}, ${margin.top + 17})`} />
        <g id="axisBottom" transform={`translate(${-margin.right}, ${height - margin.bottom + margin.top + 17})`}/>
      </svg>
    );
  }
}

export default BarChart;

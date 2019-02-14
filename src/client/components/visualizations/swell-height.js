import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getSwellHeightData } from 'selectors/visualizations.selectors';

import BarChart from 'components/common/bar-chart';

const margin = { top: 0, bottom: 70, left: 30, right: 0 };
const height = 300;
const width = 1500;

class SwellHeight extends Component {
  render() {
    const { swellHeightData } = this.props;

    return (
      <BarChart 
        title="Swell Height"
        bars={swellHeightData.bars} 
        height={height} 
        width={width} 
        margin={margin}
        viewBox={`0 -100 ${width} ${height + 200}`}
        axisLeft={swellHeightData.axisLeft}
        axisBottom={swellHeightData.axisBottom}
        xScale={swellHeightData.xScale}
        yScale={swellHeightData.yScale} />
    )
  }
}

const mapStateToProps = state => ({
  swellHeightData: getSwellHeightData({ width, height, margin })(state)
});

export default connect(mapStateToProps)(SwellHeight);

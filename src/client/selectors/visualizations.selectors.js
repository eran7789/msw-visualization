import { createSelector } from 'reselect';
import { 
  extent, 
  scaleTime, 
  scaleLinear, 
  scaleSequential,
  axisLeft, 
  axisBottom, 
  interpolateRdBu 
} from 'd3';
import moment from 'moment';

import { getForecast } from 'selectors/forecast.selectors';

export const getSwellHeightData = ({ width, height, margin }) => createSelector(
  getForecast,
  forecast => {
    const neededData = forecast.map(timeForecast => ({
      date: timeForecast.localTimestamp,
      minBreakingHeight: timeForecast.swell.absMinBreakingHeight,
      maxBreakingHeight: timeForecast.swell.absMaxBreakingHeight,
      wind: timeForecast.wind.speed
    }));

    const xScale = scaleTime()
      .domain(extent(neededData, d => d.date))
      .range([margin.left, width - margin.right]);
    const yScale = scaleLinear()
      .domain([0, extent(neededData, d => d.maxBreakingHeight)[1]])
      .range([height - margin.bottom, margin.top]);
    const colorScale = scaleSequential() 
      .domain(extent(neededData, d => d.wind).reverse())
      .interpolator(interpolateRdBu);

    const bars = neededData.map(d => ({
      x: xScale(d.date),
      y: yScale(d.maxBreakingHeight),
      height: yScale(d.minBreakingHeight) - yScale(d.maxBreakingHeight),
      width: width / (neededData.length * 1.5),
      fill: colorScale(d.wind)
    }));

    return {
      bars,
      xScale,
      yScale,
      colorScale,
      neededData,
      axisLeft: axisLeft(yScale),
      axisBottom: axisBottom(xScale)
        .ticks(bars.length)
        .tickFormat(time => {
          const dayInYear = moment.unix(time).format('ddd');
          const hourInDay = moment.unix(time).format('HH:mm:ss');

          return `${dayInYear} ${hourInDay}`;
        })
        .tickSize(1)
    };
  }
);

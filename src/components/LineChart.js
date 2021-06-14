import React, {useEffect, useState, useRef, useMemo} from 'react';
import * as d3 from 'd3'

import './line-chart.css'

const _data = [
  {
    date: 'Test',
    clicks: 10,
  },
  {
    date: 'Test 1',
    clicks: 20,
  },
  {
    date: 'Test 2',
    clicks: 5,
  },
  {
    date: 'Test 3',
    clicks: 60,
  },
  {
    date: 'Test 4',
    clicks: 50,
  },
  {
    date: 'Test 5',
    clicks: 20,
  },
  {
    date: 'Test 6',
    clicks: 40,
  },
]

const TICKS = 6

const LineChart = () => {
  const [data, setData] = useState(_data)
  const chartRef = useRef(null)
  const tooltipRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    renderChart()
  }, [])

  const margin = {top: 50, right: 50, bottom: 50, left: 50};
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const xScale = d3.scalePoint()
    .domain(data.map((d, i) => i))
    .range([0, width])

  const yScale = d3.scaleLinear()
    .domain([0, 60])
    .range([height, 0])

  const tooltipStyle = useMemo(() => {
    if (!tooltip || !chartRef.current || !tooltipRef.current) {
      return {}
    }
    const {left: chartLeft, top: chartTop} = chartRef.current.getBoundingClientRect()
    const {width: tooltipWidth, height: tooltipHeight} = tooltipRef.current.getBoundingClientRect()
    console.log(tooltipWidth)
    let left = chartLeft + xScale(tooltip.index) + margin.left - tooltipWidth / 2
    let top = chartTop + yScale(tooltip.clicks) + margin.top - tooltipHeight - 10
    if(top < chartTop) {
      top = chartTop + yScale(tooltip.clicks) + tooltipHeight + 10
    }


    return {
      left,
      top,
      visibility: 'visible',
    }
  }, [tooltip, chartRef.current, tooltipRef.current])

  const renderChart = () => {

    const lineGenerator = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d.clicks))
      .curve(d3.curveMonotoneX)

    const svg = d3.select(chartRef.current).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale).ticks(TICKS));

    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale).ticks(TICKS));


    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 3)
      .attr("d", lineGenerator);


    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", (d, i) => xScale(i))
      .attr("cy", d => yScale(d.clicks))
      .attr("r", 5)
      .on("mouseover", (d, index, dots) => {
        const dot = dots[index]
        dot.style.fill = 'red'
        setTooltip({
          ...d,
          index,
        })
      })
      .on("mouseout", (d, index, dots) => {
        const dot = dots[index]
        dot.style.fill = '#ffab00'
        setTooltip(null)
      })
  }

  return (
    <div>
      <div ref={chartRef} />

      <div ref={tooltipRef} style={tooltipStyle} className="chart-tooltip">
        <div className="date">15/10/2020</div>
        <div className="property">
          <span className="label">URL:</span>
          <span className="value">http://google.com</span>
        </div>
        <div className="property">
          <span className="label">Clicks:</span>
          <span className="value">{tooltip?.click}</span>
        </div>
      </div>
    </div>
  );
};

export default LineChart;

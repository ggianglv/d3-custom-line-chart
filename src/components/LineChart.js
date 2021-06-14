import React, { useEffect, useState, useRef, useMemo } from 'react';
import * as d3 from 'd3'

import './line-chart.css'
import Annotation from './Annotation';

const _data = [
  {
    date: 'Test',
    clicks: 10,
    annotation: 'First annotation'
  },
  {
    date: 'Test 1',
    clicks: 20,
  },
  {
    date: 'Test 2',
    clicks: 5,
    annotation: 'This is test',
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
    annotation: 'This is test annotation',
  },
]

const data2 = [
  {
    date: 'Test',
    clicks: 20,
  },
  {
    date: 'Test 1',
    clicks: 10,
  },
  {
    date: 'Test 2',
    clicks: 25,
  },
  {
    date: 'Test 3',
    clicks: 30,
  },
  {
    date: 'Test 4',
    clicks: 80,
  },
  {
    date: 'Test 5',
    clicks: 10,
  },
  {
    date: 'Test 6',
    clicks: 30,
  },
]

const TICKS = 4

const LineChart = () => {
  const [data, setData] = useState(_data)
  const chartRef = useRef(null)
  const tooltipRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    renderChart()
  }, [])
  const max = Math.max(...data.map(d => d.clicks), ...data2.map(d => d.clicks))
  const margin = {top: 50, right: 50, bottom: 50, left: 50};
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const xScale = d3.scalePoint()
    .domain(data.map((d, i) => i))
    .range([0, width])

  const yScale = d3.scaleLinear()
    .domain([0, max])
    .range([height, 0])

  const tooltipStyle = useMemo(() => {
    if (!tooltip || !chartRef.current || !tooltipRef.current) {
      return {}
    }
    const {left: chartLeft, top: chartTop} = chartRef.current.getBoundingClientRect()
    const {width: tooltipWidth, height: tooltipHeight} = tooltipRef.current.getBoundingClientRect()
    let left = chartLeft + xScale(tooltip.index) + margin.left - tooltipWidth / 2
    let top = chartTop + yScale(tooltip.clicks) + margin.top - tooltipHeight - 10
    if (top < chartTop) {
      top = chartTop + yScale(tooltip.clicks) + tooltipHeight + 10
    }

    return {
      left,
      top,
      visibility: 'visible',
    }
  }, [tooltip, chartRef.current, tooltipRef.current])

  const annotations = useMemo(() => {
    const result = []
    data.forEach((item, index) => {
      if (item.annotation) {
        result.push({
          ...item,
          index,
        })
      }
    })

    return result
  }, [data])

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
      .call(d3.axisBottom(xScale).tickFormat((_, i) => data[i].date));

    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale).ticks(TICKS));

    //Grid line
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).ticks(TICKS)
        .tickSize(-width)
        .tickFormat("").tickSizeOuter(0)
      )

    svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale)
        .tickSize(-height)
        .tickFormat("").tickSizeOuter(0)
      )


    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr('fill', 'none')
      .attr('stroke', '#8884d8')
      .attr('stroke-width', 2)
      .attr("d", lineGenerator);

    svg.append("path")
      .datum(data2)
      .attr("class", "line")
      .attr('fill', 'none')
      .attr('stroke', '#82ca9d')
      .attr('stroke-width', 2)
      .attr("d", lineGenerator);

    svg.append('g').selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("fill", "#8884d8")
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
        dot.style.fill = '#8884d8'
        setTooltip(null)
      })

    svg.append('g').selectAll("circle-2")
      .data(data2)
      .enter().append("circle")
      .attr("class", "dot2")
      .attr("fill", "#82ca9d")
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
        dot.style.fill = '#82ca9d'
        setTooltip(null)
      })
  }

  return (
    <div>
      <div ref={chartRef}/>

      <div ref={tooltipRef} style={tooltipStyle} className="chart-tooltip">
        <div className="date">15/10/2020</div>
        <div className="property">
          <span className="label">URL:</span>
          <span className="value">http://google.com</span>
        </div>
        <div className="property">
          <span className="label">Clicks:</span>
          <span className="value">{tooltip?.clicks}</span>
        </div>
      </div>

      {annotations.map((item, index) => (
        <Annotation key={index} data={item} xScale={xScale} yScale={yScale} chartRef={chartRef} margin={margin}/>
      ))}
    </div>
  );
};

export default LineChart;

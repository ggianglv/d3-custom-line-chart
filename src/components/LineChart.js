import React, { useEffect, useState, useRef, useMemo } from "react";
import * as d3 from "d3";

import "./line-chart.css";
import Annotation from "./Annotation";

const TICKS = 4;
const TOOLTIP_HEIGHT = 46;

const LineChart = ({ data, lines, width, height, annotations }) => {
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);
  const [renderKey, setRenderKey] = useState(1);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    d3.select(chartRef.current).selectAll("*").remove();
    setRenderKey(renderKey + 1);
    renderChart();
  }, [width, height, data, lines, annotations]);

  const getMax = () => {
    const arr = [];
    data.forEach((item) => {
      lines.forEach((line) => {
        arr.push(item[line.key]);
      });
    });

    return Math.max(...arr);
  };

  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const xScale = d3
    .scalePoint()
    .domain(data.map((d, i) => i))
    .range([0, chartWidth]);

  const yScale = d3.scaleLinear().domain([0, getMax()]).range([chartHeight, 0]);

  const tooltipStyle = useMemo(() => {
    if (!tooltip || !chartRef.current || !tooltipRef.current) {
      return {};
    }
    const value = tooltip[tooltip.key];
    const { left: chartLeft, top: chartTop } =
      chartRef.current.getBoundingClientRect();
    const { width: tooltipWidth } = tooltipRef.current.getBoundingClientRect();
    let left =
      chartLeft + xScale(tooltip.index) + margin.left - tooltipWidth / 2;
    let top = chartTop + yScale(value) + margin.top - TOOLTIP_HEIGHT - 10;
    if (top < chartTop) {
      top = chartTop + yScale(value) + TOOLTIP_HEIGHT + 10;
    }

    return {
      left,
      top,
      visibility: "visible",
    };
  }, [tooltip, chartRef.current, tooltipRef.current]);

  const renderChart = () => {
    const svg = d3
      .select(chartRef.current)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + chartHeight + ")")
      .call(d3.axisBottom(xScale).tickFormat((_, i) => data[i].date));

    svg
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale).ticks(TICKS));

    //Grid line
    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(TICKS)
          .tickSize(-chartWidth)
          .tickFormat("")
          .tickSizeOuter(0)
      );

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + chartHeight + ")")
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-chartHeight)
          .tickFormat("")
          .tickSizeOuter(0)
      );

    lines.forEach((line) => {
      const key = line.key;
      const lineGenerator = d3
        .line()
        .x((d, i) => xScale(i))
        .y((d) => yScale(d[key]))
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", line.color)
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);

      svg
        .append("g")
        .selectAll(`circle-${line.key}`)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("fill", line.color)
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", (d) => yScale(d[key]))
        .attr("r", 5)
        .on("mouseover", (d, index, dots) => {
          const dot = dots[index];
          dot.style.fill = "red";
          setTooltip({
            ...d,
            index,
            key,
          });
        })
        .on("mouseout", (d, index, dots) => {
          const dot = dots[index];
          dot.style.fill = line.color;
          setTooltip(null);
        });
    });
  };

  return (
    <div>
      <svg
        width={chartWidth + margin.left + margin.right}
        height={chartHeight + margin.top + margin.bottom}
        ref={chartRef}
      />

      <div ref={tooltipRef} style={tooltipStyle} className="chart-tooltip">
        <div className="date">{tooltip?.date || ""}</div>
        <div className="property">
          <span className="label">{tooltip?.key}: </span>
          <span className="value">{tooltip?.[tooltip?.key]}</span>
        </div>
      </div>

      {annotations.map((item, index) => (
        <Annotation
          key={`${index}_${renderKey}`} //Mount chart when data
          chartRef={chartRef}
          value={data[item.index][item.key]}
          data={item}
          xScale={xScale}
          yScale={yScale}
          margin={margin}
        />
      ))}
    </div>
  );
};

export default LineChart;

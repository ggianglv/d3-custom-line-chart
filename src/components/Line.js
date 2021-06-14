import React, {useEffect, useRef} from 'react';
import {select} from 'd3-selection';
import {transition} from 'd3-transition';

const Line = ({lineGenerator, xScale, yScale, data, id, color, setTooltip}) => {
  const lineRef = useRef(null)

  useEffect(() => {
    renderChart()
  }, [])

  const onMouseEnter = (d, index) => {
    setTooltip({
      ...d,
      index
    })
  }

  const onMouseLeave = () => {
    setTooltip(null)
  }

  const renderChart = () => {
    const initialData = data.map(d => ({
      date: d.date,
      clicks: 0
    }));
    select(lineRef.current)
      .append('path')
      .datum(initialData)
      .attr('id', `line-${id}`)
      .attr('stroke', color)
      .attr('stroke-width', 3)
      .attr('fill', 'none')
      .transition(transition().duration(1000))
      .attr('d', lineGenerator);

    const t = transition().duration(500);
    const line = select(`#line-${id}`);
    line
      .datum(data)
      .transition(t)
      .attr('d', lineGenerator);

    select(lineRef.current).selectAll('.circle').data(data).enter().append("circle")
      .on('mouseenter', onMouseEnter)
      .on('mouseleave', onMouseLeave)
      .transition(t).delay(500).duration(0)
      .attr("class", "circle")
      .attr('fill', color)
      .attr("r", 5)
      .attr("cx", (d, index) => xScale(index))
      .attr("cy", (d) => yScale(d.clicks))
  }

  return <g className="line-group" ref={lineRef}/>
}

export default Line;

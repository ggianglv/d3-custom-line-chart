import React, {useEffect, useRef} from "react";
import {select, selectAll} from "d3-selection";
import {axisBottom, axisLeft} from "d3-axis";
import {transition} from 'd3-transition';

const Axis = ({orient, transform, scale, ticks}) => {
  const rootRef = useRef(null)

  useEffect(() => {
    renderAxis()
  }, [])

  const renderAxis = () => {
    const node = rootRef.current;
    let axis;

    if (orient === "bottom") {
      axis = axisBottom(scale).tickFormat((d, i) => i === 0 ? null : 'test');
    }
    if (orient === "left") {
      axis = axisLeft(scale)
        .ticks(ticks);
    }
    select(node).call(axis);
  }

  const updateAxis = () => {
    const t = transition().duration(1000)

    if (orient === "left") {
      const axis = axisLeft(scale).ticks(ticks);
      selectAll(`.${orient}`).transition(t).call(axis)
    }
  }

  return (
    <g
      ref={rootRef}
      transform={transform}
      className={`${orient} axis`}
    />
  );
}

export default Axis;

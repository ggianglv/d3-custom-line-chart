import React, { useRef, useEffect, useState } from 'react';

const Annotation = ({xScale, yScale, chartRef, data, margin}) => {
  const divRef = useRef(null)
  const [divStyle, setDivStyle] = useState({})
  useEffect(() => {
    const {top: chartTop, left: chartLeft, right: chartRight} = chartRef.current.getBoundingClientRect()
    const {width, height} = divRef.current.getBoundingClientRect()
    const x = xScale(data.index)
    const y = yScale(data.clicks)
    let top = chartTop + y + margin.top - height - 10
    let left = chartLeft + x + margin.left - width / 2

    if (left + width + margin.left + margin.right > chartRight) {
      left = chartRight - width - margin.left - margin.right - 5
    }

    if (left < chartLeft + margin.left) {
      left = chartLeft + margin.left
    }


    setDivStyle({
      top,
      left,
      opacity: 1
    })
  }, [])

  const getAnnotationStyle = () => {

  }

  return (
    <div ref={divRef} style={divStyle} className="annotation-item">
      {data.annotation}
    </div>
  );
};

export default Annotation;

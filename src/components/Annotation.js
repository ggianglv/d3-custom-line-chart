import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const Annotation = ({ xScale, yScale, chartRef, data, margin, value }) => {
  const divRef = useRef(null);
  const [divStyle, setDivStyle] = useState({});
  useEffect(() => {
    const {
      top: chartTop,
      left: chartLeft,
      right: chartRight,
    } = chartRef.current.getBoundingClientRect();
    const { width, height } = divRef.current.getBoundingClientRect();
    const x = xScale(data.index);
    const y = yScale(value);
    let top = chartTop + y + margin.top - height - 10;
    let left = chartLeft + x + margin.left - width / 2;

    if (left + width + margin.left + margin.right > chartRight) {
      left = chartRight - width - margin.right;
    }

    if (left < chartLeft + margin.left) {
      left = chartLeft + margin.left;
    }

    setDivStyle({
      top,
      left,
      opacity: 1,
      backgroundColor: data.color,
    });
  }, []);

  return (
    <div ref={divRef} style={divStyle} className="annotation-item">
      {data.annotation}

      <div className="action">
        <FontAwesomeIcon onClick={() => alert("edit")} icon={faEdit} />
        <FontAwesomeIcon onClick={() => alert("delete")} icon={faTrashAlt} />
      </div>
    </div>
  );
};

export default Annotation;

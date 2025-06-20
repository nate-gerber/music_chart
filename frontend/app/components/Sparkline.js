'use client';

import React from 'react';

const Sparkline = ({ data, width = 120, height = 30, strokeWidth = 1.5, strokeColor = 'rgba(255, 255, 255, 0.7)' }) => {
  if (!data || data.length < 2) {
    return null; // Cannot draw a line with less than 2 points
  }

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  
  // Guard against all data points being the same
  const yRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - minVal) / yRange) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        points={points}
      />
    </svg>
  );
};

export default Sparkline; 
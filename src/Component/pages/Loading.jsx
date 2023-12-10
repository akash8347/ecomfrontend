import React from 'react';

const Loading = () => {
  const spinnerSize = '60px';
  const strokeWidth = '6px';

  const spinnerStyle = {
    boxSizing: 'border-box',
    width: spinnerSize,
    height: spinnerSize,
    padding: `${strokeWidth / 2}`,
    overflow: 'visible',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const circleStyle = {
    fill: 'none',
    stroke: 'currentColor',
    cx: '50%',
    cy: '50%',
    r: '50%',
    strokeWidth,
    strokeLinecap: 'round',
    transformOrigin: 'center',
  };

  const animationTransform = {
    attributeName: 'transform',
    type: 'rotate',
    values: '-90;810',
    keyTimes: '0;1',
    dur: '2s',
    repeatCount: 'indefinite',
  };

  const animationDashOffset = {
    attributeName: 'stroke-dashoffset',
    values: '0%;0%;-157.080%',
    calcMode: 'spline',
    keySplines: '0.61, 1, 0.88, 1; 0.12, 0, 0.39, 0',
    keyTimes: '0;0.5;1',
    dur: '2s',
    repeatCount: 'indefinite',
  };

  const animationDashArray = {
    attributeName: 'stroke-dasharray',
    values: '0% 314.159%;157.080% 157.080%;0% 314.159%',
    calcMode: 'spline',
    keySplines: '0.61, 1, 0.88, 1; 0.12, 0, 0.39, 0',
    keyTimes: '0;0.5;1',
    dur: '2s',
    repeatCount: 'indefinite',
  };

  return (
    <svg className="spinner" style={spinnerStyle}>
      <circle style={circleStyle}>
        <animateTransform {...animationTransform} />
        <animate {...animationDashOffset} />
        <animate {...animationDashArray} />
      </circle>
    </svg>
  );
};

export default Loading;

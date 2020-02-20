import React from 'react';
import {clamp} from '@unilogin/commons';

interface ScrollProgressDotsProps {
  dotOpacities: Array<number>;
  minimumOpacity?: number;
  maximumOpacity?: number;
}

export const ScrollProgressDots = ({dotOpacities, minimumOpacity = 0.0, maximumOpacity = 1.0}: ScrollProgressDotsProps) => {
  const dots = dotOpacities.map((opacity, i) =>
    <div key={i} style={{opacity: clamp(opacity, minimumOpacity, maximumOpacity)}} className='scroll-progress-dot'/>,
  );

  return (
    <div className="scroll-progress-dots-container">
      {dots}
    </div>
  );
};

export default ScrollProgressDots;

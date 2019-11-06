import React from 'react';

interface ScrollProgressDotsProps {
  dotOpacities: Array<number>;
  minimumOpacity?: number;
  maximumOpacity?: number;
}

export const ScrollProgressDots = ({dotOpacities, minimumOpacity = 0.0, maximumOpacity = 1.0}: ScrollProgressDotsProps) => {
  dotOpacities = dotOpacities.map((opacity) => opacity < minimumOpacity ? minimumOpacity : opacity);
  dotOpacities = dotOpacities.map((opacity) => opacity > maximumOpacity ? maximumOpacity : opacity);
  const dots = dotOpacities.map((opacity, i) =>
    <div key={i} style={{opacity}} className='scroll-progress-dot'/>,
  );

  return (
    <div className="scroll-progress-dots-container">
      {dots}
    </div>
  );
};

export default ScrollProgressDots;

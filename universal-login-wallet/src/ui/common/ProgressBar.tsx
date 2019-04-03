import React from 'react';

interface ProgressBarProps {
  dual?: boolean;
  className?: string;
}

const ProgressBar = ({dual, className}: ProgressBarProps) => (
  <div className={`progress-bar ${className ? className : ''}`}>
    <div className={`progress-bar-line ${dual ? 'dual' : ''}`} />
  </div>
);

export default ProgressBar;

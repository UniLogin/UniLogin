import React from 'react';
import '../styles/progress-bar.css'
interface ProgressBarProps {
  dual?: boolean;
  className?: string;
}

export const ProgressBar = ({dual, className}: ProgressBarProps) => (
  <div className={`progress-bar ${className ? className : ''}`}>
    <div className={`progress-bar-line ${dual ? 'dual' : ''}`} />
  </div>
);

export default ProgressBar;

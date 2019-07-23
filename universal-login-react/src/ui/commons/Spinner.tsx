import React from 'react';
import '../styles/spinner.css';

interface SpinnerProps {
  className?: string;
  dotClassName?: string;
}

export const Spinner = ({className, dotClassName}: SpinnerProps) => {
  const spinnerClassName = className ? `spinner ${className}` : 'spinner';
  const spinnerDotClassName = dotClassName ? `spinner-dot ${dotClassName}` : 'spinner-dot';

  return (
    <div className={spinnerClassName}>
      <div className={spinnerDotClassName}/>
      <div className={spinnerDotClassName}/>
      <div className={spinnerDotClassName}/>
      <div className={spinnerDotClassName}/>
      <div className={spinnerDotClassName}/>
      <div className={spinnerDotClassName}/>
      <div className={spinnerDotClassName}/>
      <div className={spinnerDotClassName}/>
      <div className={spinnerDotClassName}/>
      <div className={spinnerDotClassName}/>
      <div className={spinnerDotClassName}/>
      <div className={spinnerDotClassName}/>
    </div>
  );
};

export default Spinner;

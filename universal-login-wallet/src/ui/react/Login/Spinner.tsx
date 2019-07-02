import React from 'react';

interface SpinnerProps {
  className?: string;
  dotClassName?: string;
}

const Spinner = ({className, dotClassName}: SpinnerProps) => {
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

import React from 'react';
import {useThemeClassFor} from '../utils/classFor';
import '../styles/spinner.css';
import '../styles/themes/UniLogin/spinnerThemeUniLogin.sass';

interface SpinnerProps {
  className?: string;
  dotClassName?: string;
}

export const Spinner = ({className, dotClassName}: SpinnerProps) => {
  const spinnerClassName = className ? `spinner ${className}` : 'spinner';
  const spinnerDotClassName = dotClassName ? `spinner-dot ${dotClassName}` : 'spinner-dot';

  return (
    <div className="universal-login">
      <div className={`${useThemeClassFor()} ${spinnerClassName}`}>
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
    </div>
  );
};

export default Spinner;

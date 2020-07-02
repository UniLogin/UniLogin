import React from 'react';
import {useThemeClassFor} from '../utils/classFor';
import '../styles/base/spinner.sass';
import '../styles/themes/UniLogin/components/spinnerThemeUniLogin.sass';
import '../styles/themes/Jarvis/components/spinnerThemeJarvis.sass';

interface SpinnerProps {
  className?: string;
  dotClassName?: string;
}

export const Spinner = ({className, dotClassName}: SpinnerProps) => {
  const spinnerClassName = className ? `spinner ${className}` : 'spinner';
  const spinnerDotClassName = dotClassName ? `spinner-dot ${dotClassName}` : 'spinner-dot';

  return (
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
  );
};

export default Spinner;

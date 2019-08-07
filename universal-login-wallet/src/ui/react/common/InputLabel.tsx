import React from 'react';

interface InputLabelProps {
  htmlFor: string;
  children: any;
  className?: string;
}

const InputLabel = ({children, htmlFor, className} : InputLabelProps) => (
  <label className={`label-text ${className ? className : ''}`} htmlFor={htmlFor}>{children}</label>
);

export default InputLabel;

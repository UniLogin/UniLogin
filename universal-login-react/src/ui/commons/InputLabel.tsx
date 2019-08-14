import React from 'react';

export interface InputLabelProps {
  htmlFor: string;
  children: any;
  className?: string;
}

export const InputLabel = ({children, htmlFor, className} : InputLabelProps) => (
  <label className={`label-text ${className ? className : ''}`} htmlFor={htmlFor}>{children}</label>
);

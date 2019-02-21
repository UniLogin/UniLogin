import React from 'react';

interface InputLabelProps {
  htmlFor: string;
  children: any;
}

const InputLabel = ({children, htmlFor} : InputLabelProps) => (
  <label className="input-label" htmlFor={htmlFor}>{children}</label>
);

export default InputLabel;

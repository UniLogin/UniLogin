import React from 'react';

const InputLabel = ({children, htmlFor} : {children: any, htmlFor: string}) => (
  <label className="input-label" htmlFor={htmlFor}>{children}</label>
);

export default InputLabel;

import React from 'react';

interface InputProps {
  onChange: (...args: any[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  type?: string;
  id: string;
  value?: string;
}

/* tslint:disable:prefer-template */

const Input = ({onChange, placeholder, autoFocus, className, id, type, value}: InputProps) => {
  const extraClassName = className ? ` input-${className}` : '';
  return(
    <input
      id={id}
      className={'input' + extraClassName}
      value={value}
      onChange={onChange}
      type={type ? type : 'text'}
      autoFocus={autoFocus}
      placeholder={placeholder}
    />
  );
};

/* tslint:enable:prefer-template */

export default Input;

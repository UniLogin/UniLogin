import React from 'react';

interface InputTextProps {
  onChange: (...args: any[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  id: string;
}

const InputText = ({onChange, placeholder, autoFocus, className, id}: InputTextProps) => (
  <input
    id={id}
    className={`input ${className ? className : ''}`}
    onChange={onChange}
    type="text"
    autoFocus={autoFocus}
    placeholder={placeholder}
  />
);

export default InputText;

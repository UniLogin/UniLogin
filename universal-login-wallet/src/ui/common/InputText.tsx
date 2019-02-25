import React, { ChangeEvent } from 'react';

interface InputTextProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  id: string;
  value?: string;
}

const InputText = ({onChange, placeholder, autoFocus, className, id, value}: InputTextProps) => (
  <input
    id={id}
    className={`input ${className ? className : ''}`}
    value={value}
    onChange={onChange}
    type="text"
    autoFocus={autoFocus}
    placeholder={placeholder}
  />
);

export default InputText;

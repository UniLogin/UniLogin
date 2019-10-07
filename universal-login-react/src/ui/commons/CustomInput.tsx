import React from 'react';

interface CustomInputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  type?: string;
  id: string;
  value: string;
}

export const CustomInput = ({onChange, placeholder, autoFocus, className, id, type, value}: CustomInputProps) => {
  return(
    <input
      id={id}
      className={`custom-input ${className ? className : ''}`}
      value={value}
      onChange={onChange}
      type={type ? type : 'text'}
      autoFocus={autoFocus}
      placeholder={placeholder}
    />
  );
};

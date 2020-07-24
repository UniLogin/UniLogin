import React from 'react';
import {useClassFor} from '../utils/classFor';

interface InputProps {
  onChange: (...args: any[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  type?: string;
  id: string;
  value?: string;
  checkSpelling?: boolean;
  onFocus?: () => void;
}

export const Input = ({onChange, placeholder, autoFocus, onFocus, className, id, type, value, checkSpelling = true}: InputProps) => {
  return (
    <input
      id={id}
      className={`${useClassFor('input')} ${className || ''}`}
      value={value}
      onChange={onChange}
      type={type || 'text'}
      autoFocus={autoFocus}
      placeholder={placeholder}
      spellCheck={checkSpelling}
      autoCapitalize='off'
      onFocus={onFocus}
      autoComplete='off'
    />
  );
};

export default Input;

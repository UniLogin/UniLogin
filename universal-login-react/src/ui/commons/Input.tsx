import React from 'react';
import {classesForElement} from '@universal-login/commons';

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
  onBlur?: () => void;
}

const classesForInput = classesForElement('input', 'input');

export const Input = ({onChange, placeholder, autoFocus, onFocus, onBlur, className, id, type, value, checkSpelling = true}: InputProps) => {
  return (
    <input
      id={id}
      className={classesForInput(className)}
      value={value}
      onChange={onChange}
      type={type || 'text'}
      autoFocus={autoFocus}
      placeholder={placeholder}
      spellCheck={checkSpelling}
      autoCapitalize='off'
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default Input;

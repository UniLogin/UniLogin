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
}

const classesForInput = classesForElement('input', 'input');

export const Input = ({onChange, placeholder, autoFocus, className, id, type, value, checkSpelling = true}: InputProps) => {
  return(
    <input
      id={id}
      className={classesForInput(className)}
      value={value}
      onChange={onChange}
      type={type ? type : 'text'}
      autoFocus={autoFocus}
      placeholder={placeholder}
      spellCheck={checkSpelling}
    />
  );
};

export default Input;

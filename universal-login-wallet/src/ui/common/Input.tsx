import React from 'react';
import {classesForElement} from 'universal-login-commons';

interface InputProps {
  onChange: (...args: any[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  type?: string;
  id: string;
  value?: string;
}

const classesForInput = classesForElement('input', 'input');

const Input = ({onChange, placeholder, autoFocus, className, id, type, value}: InputProps) => {
  return(
    <input
      id={id}
      className={classesForInput(className)}
      value={value}
      onChange={onChange}
      type={type ? type : 'text'}
      autoFocus={autoFocus}
      placeholder={placeholder}
    />
  );
};

export default Input;

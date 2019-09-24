import React from 'react';
import {copy} from '@universal-login/commons';

interface InputProps {
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  id: string;
  value: string;
}

const InputWithButton = ({placeholder, autoFocus, id, className, value}: InputProps) => (
  <div className="input-copy-wrapper">
    <input
      id={id}
      className={`input input-copy ${className ? className : ''}`}
      type="text"
      readOnly
      defaultValue={value}
      placeholder={placeholder}
    />
    <button
      autoFocus={autoFocus}
      onClick={() => copy(id)}
      className="copy-btn">
      <span className="copy-btn-feedback"/>
    </button>

  </div>
);

export default InputWithButton;

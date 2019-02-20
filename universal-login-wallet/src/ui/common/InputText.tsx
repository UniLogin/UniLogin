import React from 'react';

interface InputTextProps {
  onChange: (...args: any[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  id: string;
}

const InputText = (props: InputTextProps) => (
  <input
    id={props.id}
    className={`input ${props.className ? props.className : ''}`}
    onChange={props.onChange}
    type="text"
    autoFocus={props.autoFocus}
    placeholder={props.placeholder}
  />
);

export default InputText;

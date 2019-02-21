import React from 'react';

interface TextAreaProps {
  onChange: (...args: any[]) => void;
  placeholder?: string;
  isFocused?: boolean;
  className?: string;
  id: string;
}


const TextArea = ({onChange, placeholder, isFocused, id, className}: TextAreaProps) => (
  <textarea
    id={id}
    className={`textarea ${className ? className : ''}`}
    onChange={onChange}
    autoFocus={isFocused}
    placeholder={placeholder}
  />
);

export default TextArea;

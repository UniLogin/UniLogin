import React from 'react';

interface TextBoxProps {
  onChange: (...args: any[]) => void;
  placeholder: string;
  id: string;
}

const TextBox = (props: TextBoxProps) =>
  (
    <input
      id={props.id}
      className="input"
      onChange={props.onChange}
      type="text"
      autoFocus
      placeholder={props.placeholder}
    />
  );

export default TextBox;

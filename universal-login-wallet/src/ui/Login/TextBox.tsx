import React from 'react';

interface TextBoxProps {
  onChange: (...args: any[]) => void;
  placeholder: string;
}

const TextBox = (props: TextBoxProps, ref: any) =>
  <input
    className="input"
    onChange={props.onChange}
    type="text"
    autoFocus
    placeholder={props.placeholder}
    ref={ref}
  />;

export default TextBox;

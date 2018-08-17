import React from 'react';

const TextBox = (props) => (
  <input className="input" onChange={props.onChange} type="text" placeholder={props.placeholder}/>
);

export default TextBox;
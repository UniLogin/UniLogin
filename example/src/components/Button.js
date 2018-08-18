import React from 'react';

const Button = (props) => (
  <button onClick={props.onClick} className="btn fullwidth">{props.children}</button>
);

export default Button;
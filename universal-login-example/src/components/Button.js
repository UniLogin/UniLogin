import React from 'react';
import PropTypes from 'prop-types';

const Button = props => (
  <button onClick={props.onClick} className="btn fullwidth">
    {props.children}
  </button>
);

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node
};

export default Button;

import React from 'react';
import PropTypes from 'prop-types';

const TextBox = (props) => (
  <input
    className="input"
    onChange={props.onChange}
    type="text"
    placeholder={props.placeholder}
    maxLength={props.maxlength}
  />
);
TextBox.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  maxlength: PropTypes.number
};

export default TextBox;

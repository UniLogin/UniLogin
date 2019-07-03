import React from 'react';
import PropTypes from 'prop-types';



const TextBox = React.forwardRef((props, ref) => (
  <input
    className="input"
    onChange={props.onChange}
    onKeyDown={props.onKeyDown.bind(this)}
    type="text"
    autoCapitalize="none"
    autoFocus
    placeholder={props.placeholder}
    maxLength={props.maxlength}
    ref={ref}
  />
));
TextBox.propTypes = {
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
  maxlength: PropTypes.number
};

export default TextBox;

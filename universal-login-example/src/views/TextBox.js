import React from 'react';
import PropTypes from 'prop-types';

const KEY_CODE_ARROW_DOWN = 40;

const TextBox = React.forwardRef((props, ref) => (
  <input
    className="input"
    onChange={props.onChange}
    onKeyDown={(event) => { if (event.keyCode === KEY_CODE_ARROW_DOWN) props.onArrowDownKeyPressed(event) }}
    type="text"
    autoFocus
    placeholder={props.placeholder}
    maxLength={props.maxlength}
    ref={ref}
  />
));
TextBox.propTypes = {
  onChange: PropTypes.func,
  onArrowDownKeyPressed: PropTypes.func,
  placeholder: PropTypes.string,
  maxlength: PropTypes.number
};

export default TextBox;

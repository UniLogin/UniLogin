import React from 'react';
import PropTypes from 'prop-types';

const BackToAppBtn = props => (
  <button
    onClick={() => props.setView('MainScreen')}
    className="btn back-to-app"
  >
    <span className="back-to-app-text">Back to App</span>
  </button>
);

BackToAppBtn.propTypes = {
  setView: PropTypes.func
};
export default BackToAppBtn;

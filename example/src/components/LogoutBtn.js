import React from 'react';
import PropTypes from 'prop-types';

const LogoutBtn = props => (
  <button onClick={() => props.setView('Login')} className="btn header-btn">
    LOGOUT
  </button>
);

LogoutBtn.propTypes = {
  setView: PropTypes.func
};

export default LogoutBtn;

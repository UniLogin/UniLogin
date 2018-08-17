import React from 'react';
import PropTypes from 'prop-types';

const IdentityExistingIndicator = props => (
  <div>
    <p className={props.exist ? 'login-method' : 'login-method active'}>
      Create a new Ethereum ID or
    </p>
    <p className={props.exist ? 'login-method active' : 'login-method'}>
      Connect to an existing ID
    </p>
  </div>
);

IdentityExistingIndicator.propTypes = {
  exist: PropTypes.bool
};

export default IdentityExistingIndicator;

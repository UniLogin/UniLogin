import React from 'react';

const IdentityExistingIndicator = (props) => (
  <div>
    <p className={props.exist ? 'login-method' : 'login-method active'}>Create a new Ethereum ID or</p>
    <p className={props.exist ? 'login-method active' : 'login-method'}>Connect to an existing ID</p>
  </div>
);

export default IdentityExistingIndicator;
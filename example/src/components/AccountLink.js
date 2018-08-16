import React, { Component } from 'react';

const AccountLink = props => (
  <button onClick={() => props.setView('Account')} className="btn header-btn">Account</button>
);

export default AccountLink;
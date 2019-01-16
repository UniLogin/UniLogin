import React from 'react';
import PropTypes from 'prop-types';

function HeaderWaiting(props) {
  return (
    <div className="row">
      <div className="identicon-loading loading" />
      <div>
        <p className="user-id">{props.identityName}</p>
        <p className="wallet-address">Creating new identity...</p>
      </div>
    </div>
  );
}

HeaderWaiting.propTypes = {
  identityName: PropTypes.string
};

export default HeaderWaiting;

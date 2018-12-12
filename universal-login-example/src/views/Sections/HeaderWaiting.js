import React from 'react';
import PropTypes from 'prop-types';

function HeaderWaiting(props) {
  return (
    <div className="row">
      <div className="identicon-loading loading" />
      <div>
        <p className="user-id">
          Creating new {props.identityName} identity...
        </p>
        <p className="wallet-address">
          0x0000000000000000000000000000000000000000
        </p>
      </div>
    </div>
  );
}

HeaderWaiting.propTypes = {
  identityName: PropTypes.string
};

export default HeaderWaiting;

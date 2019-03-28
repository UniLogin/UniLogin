import React from 'react';
import PropTypes from 'prop-types';

function HeaderWaiting(props) {
  return (
    <div className="row">
      <div className="identicon-loading loading" />
      <div>
        <p className="user-id">{props.walletContractName}</p>
        <p className="wallet-address">Creating new wallet contract...</p>
      </div>
    </div>
  );
}

HeaderWaiting.propTypes = {
  walletContractName: PropTypes.string
};

export default HeaderWaiting;

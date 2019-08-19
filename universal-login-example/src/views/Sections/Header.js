import React from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';

function Header(props) {
  return (
    <div className="row">
      <Blockies
        seed={props.walletContract.address}
        size={8}
        scale={8}
      />
      <div>
        <p className="user-id">{props.walletContract.name}</p>
        <p className="wallet-address">{props.walletContract.address}</p>
      </div>
    </div>
  );
}

Header.propTypes = {
  walletContract: PropTypes.object
};

export default Header;

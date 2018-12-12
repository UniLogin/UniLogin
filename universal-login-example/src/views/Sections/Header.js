import React from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';

function Header(props) {
  return (
    <div className="row">
      <Blockies
        seed={props.identity.address.toLowerCase()}
        size={8}
        scale={8}
      />
      <div>
        <p className="user-id">{props.identity.name}</p>
        <p className="wallet-address">{props.identity.address}</p>
      </div>
    </div>
  );
}

Header.propTypes = {
  identity: PropTypes.object
};

export default Header;

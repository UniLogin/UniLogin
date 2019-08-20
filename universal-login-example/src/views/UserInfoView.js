import React from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';

const UserInfoView = (props) => (
  <div className="row align-items-center">
    <Blockies seed={props.wallet.address} size={8} scale={6} />
    <div>
      <p className="user-id user-id-header">{props.userId}</p>
      <p className="wallet-address wallet-address-header">{props.wallet}</p>
    </div>
  </div>
);

UserInfoView.propTypes = {
  userIco: PropTypes.string,
  userId: PropTypes.string,
  wallet: PropTypes.string
};

export default UserInfoView;

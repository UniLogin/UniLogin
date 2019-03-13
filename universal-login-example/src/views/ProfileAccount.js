import React from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';

const ProfileAccount = (props) => (
  <div className="row align-items-center">
    <Blockies seed={props.address.toLowerCase()} size={8} scale={6} />
    <div>
      <p className="user-id">{props.userId}</p>
      <p className="wallet-address">{props.address}</p>
    </div>
    <span className="information-ico icon-info" />
  </div>
);

ProfileAccount.propTypes = {
  userIco: PropTypes.string,
  userId: PropTypes.string,
  address: PropTypes.string
};

export default ProfileAccount;

import React from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';

const ProfileIdentityAccount = props => (
  <div className="row align-items-center">
    <Blockies seed={props.address} size={16}/>
    <div>
      <p className="user-id">{props.userId}</p>
      <p className="wallet-address">{props.address}</p>
    </div>
    <span className="information-ico icon-info"></span>
  </div>
);

ProfileIdentityAccount.propTypes = {
  userIco: PropTypes.string,
  userId: PropTypes.string,
  address: PropTypes.string
};

export default ProfileIdentityAccount;

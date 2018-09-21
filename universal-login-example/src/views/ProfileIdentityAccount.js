import React from 'react';
import PropTypes from 'prop-types';

const ProfileIdentityAccount = props => (
  <div className="row align-items-center">
    <img className="user-avatar" src={props.userIco} alt="Avatar" />
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

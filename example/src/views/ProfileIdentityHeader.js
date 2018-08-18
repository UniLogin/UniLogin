import React from 'react';

const ProfileIdentityHeader = (props) => (
  <div className="row align-items-center">
    <img className="user-avatar user-avatar-header" src={props.userIco} alt="Avatar" />
    <div>
      <p className="user-id user-id-header">{props.userId}</p>
      <p className="wallet-address wallet-address-header">
        {props.address}
      </p>
    </div>
  </div>
);

export default ProfileIdentityHeader;
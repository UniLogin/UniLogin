import React from 'react';
import InfoIco from '../img/info.svg';

const ProfileIdentityAccount = (props) => (
  <div className="row align-items-center">
    <img className="user-avatar" src={props.userIco} alt="Avatar" />
    <div>
      <p className="user-id">{props.userId}</p>
      <p className="wallet-address">{props.address}</p>
    </div>
    <img className="information-ico" src={InfoIco} alt="Info" />
  </div>
);

export default ProfileIdentityAccount;
import React from 'react';
import avatar from './../../assets/avatar.svg';
import {useServices} from '../../hooks/useServices';

const UserSelect = () => {
  const {walletService} = useServices();

  return (
    <div className="user-select-wrapper">
      <div className="user-select">
        <button className="user-select-button">
          <img className="user-select-avatar" src={avatar} alt="avatar"/>
          <div>
            <p className="user-select-name">{walletService.userWallet ? walletService.userWallet.name : null}</p>
            <p className="user-select-nickname">{walletService.userWallet ? walletService.userWallet.contractAddress : null}</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default UserSelect;

import React from 'react';
import {useToggler} from '../../hooks';
import avatar from './../../assets/avatar.svg';
import {useServices} from '../../hooks/useServices';

const UserSelect = () => {
  const {visible, toggle} = useToggler();
  const {walletService} = useServices();

  return (
    <div className="user-select">
      <button onClick={toggle} className="user-select-button">
        <img className="user-select-avatar" src={avatar} alt="avatar"/>
        <div>
          <p className="user-select-name">{walletService.userWallet ? walletService.userWallet.name : 'liam.universal-id.eth'}</p>
          <p className="user-select-nickname">{walletService.userWallet ? walletService.userWallet.contractAddress : '0xa869372Cfcd5c59D65459973861363BbA45D7F86'}</p>
        </div>
      </button>
      {visible ?
      <ul className="user-select-list">
        <li className="user-select-list-item">liam.universal-id.eth</li>
        <li className="user-select-list-item">liam.statusapp.eth</li>
        <li className="user-select-list-item">liam.universal-id.eth</li>
      </ul>
      : null
      }
    </div>
  );
};

export default UserSelect;

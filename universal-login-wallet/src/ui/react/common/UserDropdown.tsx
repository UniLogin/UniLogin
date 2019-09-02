import React from 'react';
import {useRouter, useServices, useSubscription} from '../../hooks';
const Blockies = require('react-blockies').default;

const UserDropdown = () => {
  const {walletService, userDropdownService, walletPresenter: walletFormatter} = useServices();
  const isExpanded = useSubscription(userDropdownService);
  const collapseDropdown = () => userDropdownService.setDropdownVisibility(false);
  const expandDropdown = () => userDropdownService.setDropdownVisibility(true);
  const {history} = useRouter();

  const onDisconnectClick = () => {
    walletService.disconnect();
    history.push('/welcome');
  };

  return (
    <div className={`user-dropdown-wrapper ${isExpanded ? 'expanded' : ''}`}>
      <div className="user-dropdown">
        <div className="user-dropdown-header">
          <div className="user-dropdown-avatar">
            <Blockies seed={walletFormatter.getContractAddress()} size={8} scale={4} />
          </div>
          <div>
            <p className="user-dropdown-name">{walletFormatter.getName()}</p>
            <p className="user-dropdown-nickname">{walletFormatter.getContractAddress()}</p>
          </div>
          <button onClick={isExpanded ?  collapseDropdown : expandDropdown} className="user-dropdown-btn" />
        </div>
        <div className={`user-dropdown-content ${isExpanded ? 'expanded' : ''}`}>
          <button className="sign-out-btn" onClick={onDisconnectClick}>Disconnect</button>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;

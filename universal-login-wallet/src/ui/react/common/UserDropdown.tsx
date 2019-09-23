import React from 'react';
import {useRouter, useServices, useSubscription} from '../../hooks';

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
          <div>
            <p className="user-dropdown-name">{walletFormatter.getName()}</p>
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

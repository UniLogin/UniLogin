import React from 'react';
import {useServices, useSubscription, useRouter} from '../../hooks';
import {disconnectFromWallet} from '../../../core/utils/disconnectFromWallet';

const UserDropdown = () => {
  const {walletService, userDropdownService, walletPresenter: walletFormatter} = useServices();
  const router = useRouter();
  const isExpanded = useSubscription(userDropdownService);
  const collapseDropdown = () => userDropdownService.setDropdownVisibility(false);
  const expandDropdown = () => userDropdownService.setDropdownVisibility(true);

  return (
    <div className={`user-dropdown-wrapper ${isExpanded ? 'expanded' : ''}`}>
      <div className="user-dropdown">
        <div className="user-dropdown-header">
          <div>
            <p className="user-dropdown-name">{walletFormatter.getName()}</p>
          </div>
          <button onClick={isExpanded ? collapseDropdown : expandDropdown} className="user-dropdown-btn" />
        </div>
        <div className={`user-dropdown-content ${isExpanded ? 'expanded' : ''}`}>
          <button className="sign-out-btn" onClick={() => disconnectFromWallet(walletService, router)}>Disconnect</button>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;

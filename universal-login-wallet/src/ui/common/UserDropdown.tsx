import React from 'react';
import avatar from './../../assets/avatar.svg';
import {useRouter, useServices, useSubscription} from '../../hooks';


interface UserDropdownProps {
  setUnauthorized?: () => void;
}
const UserDropdown = ({setUnauthorized}: UserDropdownProps = {}) => {
  const {walletService, userDropdownService} = useServices();
  const isExpanded = useSubscription(userDropdownService);
  const collapseDropdown = () => userDropdownService.setDropdownVisibility(false);
  const expandDropdown = () => userDropdownService.setDropdownVisibility(true);
  const {history} = useRouter();

  const onDisconnectClick = () => {
    walletService.disconnect();
    setUnauthorized!();
    history.push('/login');
  };
  return (
    <div className={`user-dropdown-wrapper ${isExpanded ? 'expanded' : ''}`}>
      <div className="user-dropdown">
        <div className="user-dropdown-header">
          <img className="user-dropdown-avatar" src={avatar} alt="avatar"/>
          <div>
            <p className="user-dropdown-name">{walletService.userWallet ? walletService.userWallet.name : null}</p>
            <p className="user-dropdown-nickname">{walletService.userWallet ? walletService.userWallet.contractAddress : null}</p>
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

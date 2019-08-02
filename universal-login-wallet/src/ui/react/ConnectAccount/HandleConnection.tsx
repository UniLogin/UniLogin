import React, {useState, useEffect} from 'react';
import {EmojiForm} from '@universal-login/react';
import {Notification} from '@universal-login/commons';
import vault1x from './../../assets/illustrations/vault.png';
import vault2x from './../../assets/illustrations/vault@2x.png';
import {useServices} from '../../hooks';
import {Link} from 'react-router-dom';

export const HandleConnection = () => {
  const {sdk, walletService} = useServices();
  const [notifications, setNotifications] = useState([] as Notification[]);
  const {contractAddress, privateKey} = walletService.applicationWallet!;
  useEffect(() => sdk.subscribeAuthorisations(contractAddress, privateKey, setNotifications), []);

  return (
    <div className="main-bg">
      <div className="box-wrapper">
        <div className="box">
          <div className="box-header">
            <h1 className="box-title">Confirmation</h1>
          </div>
          <div className="box-content connect-emoji-content">
            <div className="connect-emoji-section">
              <img src={vault1x} srcSet={vault2x} alt="avatar" className="connect-emoji-img" />
              <p className="box-text connect-emoji-text">Thanks, now check another device controling this account and enter the emojis in this order:</p>
              {notifications.length > 0 && <EmojiForm
                securityCodeWithFakes={notifications[0].securityCodeWithFakes!}
                publicKey={notifications[0].key}
                sdk={sdk}
                contractAddress={contractAddress}
                privateKey={privateKey}
              />
              }
              <Link to="/" className="button-secondary connect-emoji-btn">Cancel</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

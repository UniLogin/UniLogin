import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Notification} from '@universal-login/commons';
import {EmojiForm} from '@universal-login/react';
import vault1x from './../../assets/illustrations/vault.png';
import vault2x from './../../assets/illustrations/vault@2x.png';
import {useServices} from '../../hooks';

interface ConnectNotificationProps {
  contractAddress: string;
  privateKey: string;
}

export const ConnectionNotification = ({contractAddress, privateKey}: ConnectNotificationProps) => {
  const {sdk} = useServices();
  const [notifications, setNotifications] = useState([] as Notification[]);
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
              {notifications.length > 0
                ? <EmojiForm
                  publicKey={notifications[0].key}
                  sdk={sdk}
                  contractAddress={contractAddress}
                  privateKey={privateKey}
                />
                : 'No requests to connect from other applications'
              }
              <Link to="/" className="button-secondary connect-emoji-btn">Cancel</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

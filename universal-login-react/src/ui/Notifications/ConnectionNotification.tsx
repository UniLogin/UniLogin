import React, {useState, useEffect} from 'react';
import {Notification} from '@universal-login/commons';
import vault1x from '../assets/illustrations/vault.png';
import vault2x from '../assets/illustrations/vault@2x.png';
import {EmojiForm} from './EmojiForm';
import UniversalLoginSDK from '@universal-login/sdk';


interface ConnectNotificationProps {
  contractAddress: string;
  privateKey: string;
  onCancel: () => void;
  sdk: UniversalLoginSDK;
}

export const ConnectionNotification = ({contractAddress, privateKey, onCancel, sdk}: ConnectNotificationProps) => {
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
              <p className="box-text connect-emoji-text">A new device tries to connects to this aacount. Enter the emojis in the correct order to approve it.</p>
            </div>
            {notifications.length > 0
              ? <EmojiForm
                publicKey={notifications[0].key}
                sdk={sdk}
                contractAddress={contractAddress}
                privateKey={privateKey}
              />
              : <div>
                  <p className="connect-info-text">No requests to connect from other applications</p>
                  <button onClick={onCancel} className="button-secondary connect-emoji-btn">Cancel</button>
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

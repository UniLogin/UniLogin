import React, {useState, useEffect} from 'react';
import {Notification} from '@universal-login/commons';
import {EmojiForm} from './EmojiForm';
import UniversalLoginSDK from '@universal-login/sdk';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.css';
import '../styles/emojiDefaults.css';

interface ConnectNotificationProps {
  contractAddress: string;
  privateKey: string;
  sdk: UniversalLoginSDK;
  className?: string;
}

export const ConnectionNotification = ({contractAddress, privateKey, sdk, className}: ConnectNotificationProps) => {
  const [notifications, setNotifications] = useState([] as Notification[]);
  useEffect(() => sdk.subscribeAuthorisations(contractAddress, privateKey, setNotifications), []);

  return (
    <div className={getStyleForTopLevelComponent(className)}>
      <div className="universal-login-emojis">
        {notifications.length > 0
          ? <EmojiForm
            publicKey={notifications[0].key}
            sdk={sdk}
            contractAddress={contractAddress}
            privateKey={privateKey}
          />
          : <p className="connection-device-status">No requests to connect from other applications</p>
        }
      </div>
    </div>
  );
};

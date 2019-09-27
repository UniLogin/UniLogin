import React, {useState, useEffect} from 'react';
import {Notification} from '@universal-login/commons';
import {EmojiForm} from './EmojiForm';
import {DeployedWallet} from '@universal-login/sdk';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.sass';
import '../styles/emojiDefaults.sass';

interface ConnectNotificationProps {
  deployedWallet: DeployedWallet;
  className?: string;
}

export const ConnectionNotification = ({deployedWallet, className}: ConnectNotificationProps) => {
  const [notifications, setNotifications] = useState([] as Notification[]);
  const [showTitle, setShowTitle] = useState(true);
  useEffect(() => deployedWallet.subscribeAuthorisations(setNotifications), []);

  return (
    <div className="universal-login-emojis">
      <div className={getStyleForTopLevelComponent(className)}>
        {notifications.length > 0
          ?
          <>
            {showTitle &&
              <>
                <p className="approve-device-title">Approve device</p>
                <p className="approve-device-text">A new device tries to connect to this account. Enter emojis in the correct order to approve it.</p>
              </>
            }
            <EmojiForm
              deployedWallet={deployedWallet}
              hideTitle={() => setShowTitle(false)}
              className={className}
            />
          </>
          : <p className="connection-device-status">No requests to connect from other applications</p>
        }
      </div>
    </div>
  );
};

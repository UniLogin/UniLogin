import React, {useState} from 'react';
import {EmojiForm} from './EmojiForm';
import {DeployedWallet} from '@universal-login/sdk';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.sass';
import '../styles/emojiDefaults.sass';
import {useHistory} from 'react-router';
import {join} from 'path';

interface ConnectNotificationProps {
  deployedWallet: DeployedWallet;
  devicesBasePath: string;
  className?: string;
}

export const ConnectionNotification = ({deployedWallet, devicesBasePath, className}: ConnectNotificationProps) => {
  const [showTitle, setShowTitle] = useState(true);

  const history = useHistory();

  return (
    <div id="notifications" className="universal-login-emojis">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="approve-device">
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
            onDenyRequests={() => history.goBack()}
            onConnectionSuccess={() => history.replace(join(devicesBasePath, 'connectionSuccess'))}
          />
        </div>
      </div>
    </div>
  );
};

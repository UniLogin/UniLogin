import React, {useState, useEffect} from 'react';
import {Notification, GasParameters} from '@universal-login/commons';
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
  const [notifications, setNotifications] = useState([] as Notification[]);
  const [showTitle, setShowTitle] = useState(true);
  const [gasParameters, setGasParameters] = useState<GasParameters | undefined>(undefined);
  useEffect(() => deployedWallet.subscribeAuthorisations(setNotifications), []);

  const history = useHistory();

  const onDenyButtonClick = () => {
    deployedWallet.denyRequests();
    history.goBack();
  };

  const onCancelClick = async () => {
    await deployedWallet.denyRequests();
    onDenyButtonClick();
  }

  return (
    <div id="notifications" className="universal-login-emojis">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="approve-device">
          {notifications.length > 0 && (
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
                onDenyRequests={onDenyButtonClick}
                onConnectionSuccess={() => history.replace(join(devicesBasePath, 'connectionSuccess'))}
                notifications={notifications}
                gasParameters={gasParameters}
                setGasParameters={setGasParameters}
                onCancelClick={onCancelClick}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

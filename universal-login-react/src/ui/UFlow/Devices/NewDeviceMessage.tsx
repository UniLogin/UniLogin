import React, {useEffect, useState} from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import './../../styles/newDeviceMessage.sass';
import './../../styles/newDeviceMessageDefault.sass';
import {Spinner} from '../../commons/Spinner';

interface NewDeviceMessageProps {
  deployedWallet: DeployedWallet;
  onManageClick: () => void;
  className?: string;
}

export const NewDeviceMessage = ({deployedWallet, onManageClick, className}: NewDeviceMessageProps) => {
  const [notifications, setNotifications] = useState([] as Notification[]);
  useEffect(() => deployedWallet.subscribeAuthorisations(setNotifications), []);

  const [isLoading, setIsLoading] = useState(false);

  async function onDeny() {
    setIsLoading(true);
    await deployedWallet.denyRequests();
  }

  useEffect(() => {
    if (isLoading && notifications.length === 0) {
      setIsLoading(false);
    }
  }, [notifications.length, isLoading]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="universal-login-devices-message">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="devices-message">
          <div className="devices-message-row">
            <div className="devices-message-description">
              <h3 className="devices-message-title">New device(s) want to connect to this account</h3>
              <p className="devices-message-text">We noticed a connection from an unrecognized device, you need to enter an
                  emoji sequence before you can access your account.</p>
            </div>
            {isLoading ? (
              <Spinner/>
            ) : (
              <div className="devices-message-buttons-row">
                <button onClick={onManageClick} className="devices-message-button">Connect</button>
                <button onClick={onDeny} className="devices-message-cancel">Deny</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

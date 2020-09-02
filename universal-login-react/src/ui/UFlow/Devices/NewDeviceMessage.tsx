import React, {useEffect, useState} from 'react';
import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import './../../styles/base/newDeviceMessage.sass';
import './../../styles/themes/Legacy/newDeviceMessageThemeLegacy.sass';
import './../../styles/themes/UniLogin/newDeviceMessageThemeUniLogin.sass';
import './../../styles/themes/Jarvis/newDeviceMessageThemeJarvis.sass';
import {Spinner} from '../../commons/Spinner';
import {useAsyncEffect} from '../../hooks/useAsyncEffect';
import {ThemedComponent} from '../../commons/ThemedComponent';

interface NewDeviceMessageProps {
  deployedWallet: DeployedWithoutEmailWallet;
  onManageClick: () => void;
}

export const NewDeviceMessage = ({deployedWallet, onManageClick}: NewDeviceMessageProps) => {
  const [notifications, setNotifications] = useState([] as Notification[]);
  useAsyncEffect(() => deployedWallet.subscribeAuthorisations(setNotifications), []);

  const [isLoading, setIsLoading] = useState(false);

  async function onDeny() {
    setIsLoading(true);
    try {
      await deployedWallet.denyRequests();
    } catch {
      setIsLoading(false);
    }
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
    <ThemedComponent name="devices-message">
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
    </ThemedComponent>
  );
};

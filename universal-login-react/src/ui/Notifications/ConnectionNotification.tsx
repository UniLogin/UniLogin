import React, {useState} from 'react';
import {Notification, GasParameters, ensureNotFalsy, DEFAULT_GAS_LIMIT} from '@unilogin/commons';
import {EmojiForm} from './EmojiForm';
import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import '../styles/base/emoji.sass';
import '../styles/themes/Legacy/emojiThemeLegacy.sass';
import '../styles/themes/UniLogin/emojiThemeUniLogin.sass';
import '../styles/themes/Jarvis/emojiThemeJarvis.sass';
import '../styles/themes/Jarvis/footerThemeJarvis.sass';
import {useHistory} from 'react-router';
import {join} from 'path';
import {GasPrice} from '../commons/GasPrice/GasPrice';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import {FooterSection} from '../commons/FooterSection';
import Spinner from '../commons/Spinner';
import {ThemedComponent} from '../commons/ThemedComponent';

interface ConnectNotificationProps {
  deployedWallet: DeployedWithoutEmailWallet;
  devicesBasePath: string;
}

export const ConnectionNotification = ({deployedWallet, devicesBasePath}: ConnectNotificationProps) => {
  const [notifications, setNotifications] = useState([] as Notification[]);
  const [showHeader, setShowHeader] = useState(true);
  const [gasParameters, setGasParameters] = useState<GasParameters | undefined>(undefined);
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);

  const history = useHistory();

  const updateNotifications = (notifications: Notification[]) => notifications.length === 0
    ? history.goBack()
    : setNotifications(notifications);

  useAsyncEffect(() => deployedWallet.subscribeAuthorisations(updateNotifications), []);

  const onConnectClick = async (gasParameters: GasParameters | undefined) => {
    try {
      ensureNotFalsy(gasParameters, TypeError);
      ensureNotFalsy(publicKey, Error, 'Invalid key');
      history.replace(join(devicesBasePath, 'waitingForConnection'), {transactionHash: undefined});
      const {waitToBeSuccess, waitForTransactionHash} = await deployedWallet.addKey(publicKey!, gasParameters!);
      const {transactionHash} = await waitForTransactionHash();
      ensureNotFalsy(transactionHash, TypeError);
      history.replace(join(devicesBasePath, 'waitingForConnection'), {transactionHash});
      await waitToBeSuccess();
      history.replace(join(devicesBasePath, 'connectionSuccess'));
    } catch (e) {
      console.error(e);
      history.replace(join(devicesBasePath, 'connectionFailed'), {error: e.message});
    }
  };

  return notifications.length !== 0 ? (
    <ThemedComponent id="notifications" name="emoji">
      <div className="approve-device">
        {showHeader &&
          <>
            <p className="approve-device-title">Confirm connection</p>
            <p className="approve-device-text">A new device tries to connect to this account. Enter emojis in the correct order to approve it.</p>
          </>
        }
        <EmojiForm
          hideHeader={() => setShowHeader(false)}
          notifications={notifications}
          onDenyClick={() => deployedWallet.denyRequests()}
          setPublicKey={setPublicKey}
        />
        {publicKey && notifications.length > 0 &&
          <div className="correct-input-footer">
            <FooterSection>
              <GasPrice
                isDeployed={true}
                deployedWallet={deployedWallet}
                gasLimit={DEFAULT_GAS_LIMIT}
                onGasParametersChanged={setGasParameters}
                sdk={deployedWallet.sdk}
              />
              <div className="footer-buttons-row two">
                <button onClick={() => deployedWallet.denyRequests()} className="footer-deny-btn">Deny</button>
                <button onClick={() => onConnectClick(gasParameters)} className="footer-approve-btn" disabled={!gasParameters}>Connect device</button>
              </div>
            </FooterSection>
          </div>}
      </div>
    </ThemedComponent>
  )
    : <Spinner className="spinner-center" />;
};

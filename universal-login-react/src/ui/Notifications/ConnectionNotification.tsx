import React, {useState, useEffect} from 'react';
import {Notification, GasParameters, ensureNotNull} from '@universal-login/commons';
import {EmojiForm} from './EmojiForm';
import {DeployedWallet} from '@universal-login/sdk';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.sass';
import '../styles/emojiDefaults.sass';
import {transactionDetails} from '../../core/constants/TransactionDetails';
import {useHistory} from 'react-router';
import {join} from 'path';
import {FooterSection} from '../commons/FooterSection';
import {GasPrice} from '../commons/GasPrice';

interface ConnectNotificationProps {
  deployedWallet: DeployedWallet;
  devicesBasePath: string;
  className?: string;
}

export const ConnectionNotification = ({deployedWallet, devicesBasePath, className}: ConnectNotificationProps) => {
  const [notifications, setNotifications] = useState([] as Notification[]);
  const [showHeader, setShowHeader] = useState(true);
  const [gasParameters, setGasParameters] = useState<GasParameters | undefined>(undefined);
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);

  const history = useHistory();

  const updateNotifications = (notifications: Notification[]) => notifications.length === 0
    ? history.goBack()
    : setNotifications(notifications);

  useEffect(() => deployedWallet.subscribeAuthorisations(updateNotifications), []);

  const onConnectClick = async (gasParameters: GasParameters | undefined) => {
    ensureNotNull(gasParameters, TypeError);
    ensureNotNull(publicKey, Error, 'Invalid key');

    history.replace(join(devicesBasePath, 'waitingForConnection'), {transactionHash: undefined});
    const {waitToBeSuccess, waitForTransactionHash} = await deployedWallet.addKey(publicKey!, {...transactionDetails, ...gasParameters});

    const {transactionHash} = await waitForTransactionHash();
    ensureNotNull(transactionHash, TypeError);
    history.replace(join(devicesBasePath, 'waitingForConnection'), {transactionHash});

    await waitToBeSuccess();
    history.replace(join(devicesBasePath, 'connectionSuccess'));
  };

  return (
    <div id="notifications" className="universal-login-emojis">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="approve-device">
          {showHeader &&
            <>
              <p className="approve-device-title">Approve device</p>
              <p className="approve-device-text">A new device tries to connect to this account. Enter emojis in the correct order to approve it.</p>
            </>
          }
          <EmojiForm
            hideHeader={() => setShowHeader(false)}
            className={className}
            notifications={notifications}
            onDenyClick={() => deployedWallet.denyRequests()}
            setPublicKey={setPublicKey}
          />
          {publicKey && notifications.length > 0 &&
            <div className="correct-input-footer">
              <FooterSection className={className}>
                <GasPrice
                  isDeployed={true}
                  deployedWallet={deployedWallet}
                  gasLimit={transactionDetails.gasLimit!}
                  onGasParametersChanged={setGasParameters}
                  className={className}
                />
                <div className="footer-buttons-row">
                  <button onClick={() => deployedWallet.denyRequests()} className="footer-deny-btn">Deny</button>
                  <button onClick={() => onConnectClick(gasParameters)} className="footer-approve-btn" disabled={!gasParameters}>Connect device</button>
                </div>
              </FooterSection>
            </div>}
        </div>
      </div>
    </div>
  );
};

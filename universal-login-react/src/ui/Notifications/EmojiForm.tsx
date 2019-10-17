import React, {useEffect, useState} from 'react';
import {
  filterNotificationByCodePrefix,
  INITIAL_GAS_PARAMETERS,
  isValidCode,
  Notification,
  SECURITY_CODE_LENGTH,
} from '@universal-login/commons';
import {DeployedWallet} from '@universal-login/sdk';
import {EmojiPlaceholders} from './EmojiPlaceholders';
import {transactionDetails} from '../../core/constants/TransactionDetails';
import ProgressBar from '../commons/ProgressBar';
import {useProgressBar} from '../hooks/useProgressBar';
import {GasPrice} from '../commons/GasPrice';
import CheckmarkIcon from './../assets/icons/correct.svg';
import {FooterSection} from '../commons/FooterSection';
import {EmojiInput} from './EmojiInput';

export interface EmojiFormProps {
  deployedWallet: DeployedWallet;
  onConnectionSuccess: () => void;
  onDenyRequests?: () => void;
  hideTitle?: () => void;
  className?: string;
}

export const EmojiForm = ({deployedWallet, hideTitle, className, onDenyRequests, onConnectionSuccess}: EmojiFormProps) => {
  const [enteredCode, setEnteredCode] = useState<number[]>([]);
  const {progressBar, showProgressBar} = useProgressBar();
  const [gasParameters, setGasParameters] = useState(INITIAL_GAS_PARAMETERS);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => deployedWallet.subscribeAuthorisations(setNotifications), []);

  const addresses = filterNotificationByCodePrefix(notifications, enteredCode);
  const hint = addresses.length === 1 ? addresses[0] : undefined;

  const isInputValid = enteredCode.length === SECURITY_CODE_LENGTH && addresses.length === 1 && isValidCode(enteredCode, addresses[0]);

  useEffect(() => {
    if (isInputValid) {
      hideTitle && hideTitle();
    }
  }, [isInputValid]);

  const onConnectClick = async () => {
    const {waitToBeSuccess} = await deployedWallet.addKey(addresses[0], {...transactionDetails, ...gasParameters});
    showProgressBar();
    await waitToBeSuccess();
    onConnectionSuccess();
  };

  const onCancelClick = () => {
    deployedWallet.denyRequests();
    onDenyRequests && onDenyRequests();
  };

  const renderContent = () => {
    if (isInputValid) {
      return (
        <div className="correct-input">
          <img className="correct-input-img" src={CheckmarkIcon} alt="checkmark" />
          <p className="correct-input-title">Correct!</p>
          <EmojiPlaceholders
            enteredCode={enteredCode}
            onEmojiClick={() => {}}
            className={className}
          />
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
                <button onClick={onCancelClick} className="footer-cancel-btn">Cancel</button>
                <button onClick={onConnectClick} className="footer-approve-btn">Connect device</button>
              </div>
            </FooterSection>
          </div>
        </div>
      );
    }

    return (
      <div className="approve-device-form">
        <EmojiInput
          value={enteredCode}
          onChange={setEnteredCode}
          hint={hint}
          className={className}
        />
        <div className="emojis-form-reject-wrapper">
          <button
            className="emojis-form-reject"
            id="reject"
            onClick={onCancelClick}
          >
            Deny
          </button>
        </div>
      </div>
    );
  };

  return (
    <div id="emojis">
      {progressBar ? <Loader /> : renderContent()}
    </div>
  );
};

const Loader = () => (
  <div className="emoji-form-loader">
    <p className="emojis-form-title">Connecting new device...</p>
    <ProgressBar className="connection-progress-bar" />
  </div>
);

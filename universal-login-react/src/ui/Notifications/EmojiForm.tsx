import React, {useEffect, useState} from 'react';
import {
  filterNotificationByCodePrefix,
  isValidCode,
  Notification,
  SECURITY_CODE_LENGTH,
  GasParameters,
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
  onRequestsDenied?: () => void;
  hideTitle?: () => void;
  className?: string;
}

export const EmojiForm = ({deployedWallet, hideTitle, className, onRequestsDenied: onDenyRequests, onConnectionSuccess}: EmojiFormProps) => {
  const [enteredCode, setEnteredCode] = useState<number[]>([]);
  const {progressBar, showProgressBar} = useProgressBar();
  const [gasParameters, setGasParameters] = useState<GasParameters | undefined>(undefined);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soleAddress, setSoleAddress] = useState<string | undefined>(undefined);

  useEffect(() => deployedWallet.subscribeAuthorisations(onNotificationsChange), []);

  const onNotificationsChange = (notifications: Notification[]) => {
    setNotifications(notifications);
    updateSoleAddress(filterNotificationByCodePrefix(notifications, enteredCode));
  };

  const isInputValid = enteredCode.length === SECURITY_CODE_LENGTH && soleAddress && isValidCode(enteredCode, soleAddress);

  useEffect(() => {
    if (isInputValid) {
      hideTitle && hideTitle();
    }
  }, [isInputValid]);

  const updateEnteredCode = (code: number[]) => {
    setEnteredCode(code);
    updateSoleAddress(filterNotificationByCodePrefix(notifications, code));
  };

  const updateSoleAddress = (addresses: string[]) => {
    if (addresses.length > 1) {
      setSoleAddress(undefined);
    } else if (addresses.length === 1) {
      setSoleAddress(addresses[0]);
    }
  };

  const onConnectClick = async () => {
    if (!soleAddress || !gasParameters) {
      throw new TypeError();
    }
    const {waitToBeSuccess} = await deployedWallet.addKey(soleAddress, {...transactionDetails, ...gasParameters});
    showProgressBar();
    await waitToBeSuccess();
    onConnectionSuccess();
  };

  const onCancelClick = async () => {
    await deployedWallet.denyRequests();
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
                <button onClick={onConnectClick} className="footer-approve-btn" disabled={!gasParameters}>Connect device</button>
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
          onChange={updateEnteredCode}
          publicKey={soleAddress}
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

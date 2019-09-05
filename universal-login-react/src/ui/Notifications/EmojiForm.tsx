import React, {useState, useEffect} from 'react';
import {isValidCode, SECURITY_CODE_LENGTH, Notification, filterNotificationByCodePrefix} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {EmojiPlaceholders} from './EmojiPlaceholders';
import {transactionDetails} from '../../core/constants/TransactionDetails';
import ProgressBar from '../commons/ProgressBar';
import {useProgressBar} from '../hooks/useProgressBar';
import {EmojiKeyboard} from './EmojiKeyboard';
import {EmojiPanelWithFakes} from './EmojiPanelWithFakes';

type InputModeType = 'keyboard' | 'panelWithFakes' | 'none';

const getInputModeFor = (addresses: string[], currentInputMode: InputModeType): InputModeType => {
  if (addresses.length > 1) {
    return 'keyboard';
  } else if (addresses.length === 1) {
    return 'panelWithFakes';
  }
  return currentInputMode;
};

interface EmojiFormProps {
  sdk: UniversalLoginSDK;
  contractAddress: string;
  privateKey: string;
  hideTitle?: () => void;
  className?: string;
}

export const EmojiForm = ({sdk, contractAddress, privateKey, hideTitle, className}: EmojiFormProps) => {
  const [enteredCode, setEnteredCode] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [inputMode, setInputMode] = useState<InputModeType>('none');
  const [addresses, setAddresses] = useState<string[]>([]);
  const {progressBar, showProgressBar} = useProgressBar();

  useEffect(() => sdk.subscribeAuthorisations(contractAddress, privateKey, (notifications: Notification[]) => {
    setNotifications(notifications);
    updateAddressesAndInputMode(notifications);
  }), []);

  const updateAddressesAndInputMode = (notifications: Notification[]) => {
    const addresses = filterNotificationByCodePrefix(notifications, enteredCode);
    setInputMode(getInputModeFor(addresses, inputMode));
    setAddresses(addresses);
  };

  const checkCode = () => {
    if (enteredCode.length !== SECURITY_CODE_LENGTH || addresses.length !== 1) {
      return false;
    }
    return isValidCode(enteredCode, addresses[0]);
  };

  const confirmCode = (address: string) => {
    sdk.addKey(contractAddress, address, privateKey, transactionDetails);
    hideTitle ? hideTitle() : null;
    showProgressBar();
  };

  const onEmojiAdd = (code: number) => {
    if (enteredCode.length < SECURITY_CODE_LENGTH) {
      enteredCode.push(code);
      setEnteredCode([...enteredCode]);
      updateAddressesAndInputMode(notifications);
    }
    if (checkCode()) {
      confirmCode(addresses[0]);
    }
  };

  const onEmojiRemove = (index: number) => {
    if (enteredCode.length >= 0) {
      enteredCode.splice(index, 1);
      setEnteredCode([...enteredCode]);
    }
    updateAddressesAndInputMode(notifications);
  };

  const renderKeyboard = (inputMode: string) => {
    if (inputMode === 'none') {
      return null;
    } else if (inputMode === 'keyboard') {
      return <EmojiKeyboard onEmojiClick={onEmojiAdd} className={className} />;
    }
    return (
      <EmojiPanelWithFakes
        publicKey={addresses[0]}
        onEmojiClick={onEmojiAdd}
        className={className}
      />
    );
  };

  const onDenyNotifications = () => {
    notifications.forEach(notification => sdk.denyRequests(contractAddress, privateKey));
  };

  return (
    <div id="emojis">
    {progressBar
      ? <div className="emoji-form-loader">
          <p className="emojis-form-title">Connecting new device...</p>
          <ProgressBar className="connection-progress-bar" />
        </div>
      : <>
          <EmojiPlaceholders
            enteredCode={enteredCode}
            onEmojiClick={onEmojiRemove}
            className={className}
          />
          {renderKeyboard(inputMode)}
          <button
            className="emojis-form-reject"
            id="reject"
            onClick={onDenyNotifications}
          >
            Deny
          </button>
        </>
    }
    </div>
  );
};

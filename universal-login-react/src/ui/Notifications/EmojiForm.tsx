import React, {useState, useEffect} from 'react';
import {isValidCode, SECURITY_CODE_LENGTH, Notification, filterNotificationByCodePrefix, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
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
  const [status, setStatus] = useState('Initial status');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [inputMode, setInputMode] = useState<InputModeType>('none');
  const [addresses, setAddresses] = useState<string[]>([]);
  const {progressBar, showProgressBar} = useProgressBar();

  useEffect(() => sdk.subscribeAuthorisations(contractAddress, privateKey, (notifications: Notification[]) => {
    setNotifications(notifications);
    setAddressesAndInputMode(notifications);
  }), []);

  const setAddressesAndInputMode = (notifications: Notification[]) => {
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
    setStatus('');
  };

  const onEmojiAdd = (code: number) => {
    if (enteredCode.length < SECURITY_CODE_LENGTH) {
      enteredCode.push(code);
      setEnteredCode([...enteredCode]);
      setAddressesAndInputMode(notifications);
    }
    if (checkCode()) {
      setStatus(``);
      confirmCode(addresses[0]);
    }
    else {
      setStatus(`Code doesn't match any incoming notification`);
    }
  };

  const onEmojiRemove = (index: number) => {
    setAddressesAndInputMode(notifications);
    if (enteredCode.length >= 0) {
      enteredCode.splice(index, 1);
      setEnteredCode([...enteredCode]);
      setStatus('');
    }
  };

  const renderPanelOrKeyboard = () => {

  };

  return (
    <div id="emojis">
    {progressBar ?
      <div>
        <p className="approve-device-title">Connecting new device...</p>
        <ProgressBar className="connection-progress-bar" />
      </div> :
      <>
        <EmojiPlaceholders enteredCode={enteredCode} onEmojiClick={onEmojiRemove} className={className}/>
        {inputMode === 'none'
          ? null
          : inputMode === 'keyboard'
          ? <EmojiKeyboard onEmojiClick={onEmojiAdd} className={className}/>
          : <EmojiPanelWithFakes publicKey={addresses[0]} onEmojiClick={onEmojiAdd} className={className}/>}
        <p className="emojis-form-status">{status}</p>
        <button className="emojis-form-reject" id="reject" onClick={() => sdk.denyRequest(contractAddress, TEST_ACCOUNT_ADDRESS, privateKey)}>Deny</button>
      </>
    }
    </div>
  );
};

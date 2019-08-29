import React, {useState} from 'react';
import {isValidCode, SECURITY_CODE_LENGTH, Notification, filterNotificationByCodePrefix, CONNECTION_REAL_ADDRESS, ATTACKER_ADDRESS_1_COMMON_CODE, ATTACKER_ADDRESS_NO_COMMON_CODE, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {EmojiPlaceholders} from './EmojiPlaceholders';
import {transactionDetails} from '../../core/constants/TransactionDetails';
import ProgressBar from '../commons/ProgressBar';
import {useProgressBar} from '../hooks/useProgressBar';
import {useInputMode} from '../hooks/useInputMode';
import {EmojiKeyboard} from './EmojiKeyboard';
import {EmojiPanelWithFakes} from './EmojiPanelWithFakes';
import {InputMode} from '../../core/models/InputMode';

const incomingNotifications = [
  {key: CONNECTION_REAL_ADDRESS},
  ...ATTACKER_ADDRESS_1_COMMON_CODE.map(address => ({key: address})),
  ...ATTACKER_ADDRESS_NO_COMMON_CODE.map(address => ({key: address}))
] as unknown as Notification[];

interface EmojiKeyboardFormProps {
  sdk: UniversalLoginSDK;
  contractAddress: string;
  privateKey: string;
  hideTitle?: () => void;
  className?: string;
}

export const EmojiKeyboardForm = ({sdk, contractAddress, privateKey, hideTitle, className}: EmojiKeyboardFormProps) => {
  const [enteredCode, setEnteredCode] = useState([] as number[]);
  const [status, setStatus] = useState('Initial status');
  const {inputMode, updateInputMode} = useInputMode();
  const {progressBar, showProgressBar} = useProgressBar();

  const possibleAddressFound = filterNotificationByCodePrefix(incomingNotifications, enteredCode);
  updateInputMode(possibleAddressFound);

  const checkCode = (address: string | undefined) => {
    if (address && isValidCode(enteredCode, address)) {
      setStatus(``);
      return true;
    }
    setStatus(`Code doesn't match any incoming notification`);
    return false;
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
    }
    if (enteredCode.length === SECURITY_CODE_LENGTH && checkCode(inputMode.address)) {
      confirmCode(inputMode.address!);
    }
  };

  const onEmojiRemove = (index: number) => {
    if (enteredCode.length >= 0) {
      enteredCode.splice(index, 1);
      setEnteredCode([...enteredCode]);
      setStatus('');
    }
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
        {inputMode.mode === InputMode.KeyboardMode
          ? <EmojiKeyboard onEmojiClick={onEmojiAdd} className={className}/>
          : <EmojiPanelWithFakes publicKey={inputMode.address!} onEmojiClick={onEmojiAdd} className={className}/>}
        <p className="emojis-form-status">{status}</p>
        <button className="emojis-form-reject" id="reject" onClick={() => sdk.denyRequest(contractAddress, TEST_ACCOUNT_ADDRESS, privateKey)}>Deny</button>
      </>
    }
    </div>
  );
};

import React, {useState} from 'react';
import {EmojiPlaceholders} from './EmojiPlaceholders';
import {EmojiPanelWithFakes} from './EmojiPanelWithFakes';
import {isValidCode} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {transactionDetails} from '../../core/constants/TransactionDetails';


interface EmojiFormProps {
  sdk: UniversalLoginSDK;
  publicKey: string;
  contractAddress: string;
  privateKey: string;
}

export const EmojiForm = ({sdk, publicKey, contractAddress, privateKey}: EmojiFormProps) => {
  const [enteredCode, setEnteredCode] = useState([] as number[]);
  const [status, setStatus] = useState('');

  const EMOJIS_MAX_LENGTH = 6;

  const confirmWithCodeCheck = (publicKey: string) => {
    if (isValidCode(enteredCode, publicKey)) {
      sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails);
      setStatus('');
    } else {
      setStatus('Invalid code. Try again.');
    }
  };

  const onEmojiAdd = (code: number) => {
    if (enteredCode.length < EMOJIS_MAX_LENGTH) {
      enteredCode.push(code);
      setEnteredCode([...enteredCode]);
    }
  };

  const onEmojiRemove = (index: number) => {
    if (enteredCode.length >= 0) {
      enteredCode.splice(index, 1);
      setEnteredCode([...enteredCode]);
    }
  };

  return (
    <div id="emojis">
      <EmojiPlaceholders maxLength={EMOJIS_MAX_LENGTH} code={enteredCode} onEmojiClicked={onEmojiRemove} />
      <EmojiPanelWithFakes publicKey={publicKey} onEmojiClicked={onEmojiAdd} />
      <div className="notification-buttons-row">
        <button className="emojis-form-reject" id="reject" onClick={() => sdk.denyRequest(contractAddress, publicKey, privateKey)}>Reject</button>
        <button className="emojis-form-confirm" id="confirm" onClick={() => confirmWithCodeCheck(publicKey)}>Confirm</button>
        <p className="emojis-form-status">{status}</p>
      </div>
    </div>
  );
};

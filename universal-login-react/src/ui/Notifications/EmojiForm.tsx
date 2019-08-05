import React, {useState} from 'react';
import {EmojiPlaceholders} from './EmojiPlaceholders';
import {EmojiPanelWithFakes} from './EmojiPanelWithFakes';
import {isValidCode, generateCodeWithFakes} from '@universal-login/commons';
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

  const confirmWithCodeCheck = (publicKey: string) => {
    if (isValidCode(enteredCode, publicKey)) {
      sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails);
      setStatus('');
    } else {
      setStatus('Invalid code. Try again.');
    }
  };

  const onEmojiAdd = (code: number) => {
    if (enteredCode.length < 6) {
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
    <div>
      <EmojiPlaceholders code={enteredCode} onEmojiClicked={onEmojiRemove} />
      <EmojiPanelWithFakes securityCodeWithFakes={generateCodeWithFakes(publicKey)} onEmojiClicked={onEmojiAdd} />
      <div className="notification-buttons-row">
        <button id="reject" onClick={() => sdk.denyRequest(contractAddress, publicKey, privateKey)}>Reject</button>
        <button id="confirm" onClick={() => confirmWithCodeCheck(publicKey)}>Confirm</button>
        <p>{status}</p>
      </div>
    </div>
  );
};

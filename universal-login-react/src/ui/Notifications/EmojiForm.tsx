import React, {useState} from 'react';
import {EmojiPlaceholders} from './EmojiPlaceholders';
import {EmojiPanelWithFakes} from './EmojiPanelWithFakes';
import {isValidCode} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';

interface EmojiFormProps {
  sdk: UniversalLoginSDK;
  publicKey: string;
  securityCodeWithFakes: number[];
}

export const EmojiForm = ({sdk, publicKey, securityCodeWithFakes}: EmojiFormProps) => {
  const [enteredCode, setEnteredCode] = useState([] as number[]);
  const [errorMessage, setErrorMessage] = useState('');

  const confirmWithCodeCheck = (publicKey: string) => {
    if (isValidCode(enteredCode, publicKey)) {
      console.log('OK: confirmed');
      setErrorMessage('');
    } else {
      setErrorMessage('Wrong security code. Try again or deny request.');
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
      <EmojiPanelWithFakes securityCodeWithFakes={securityCodeWithFakes} onEmojiClicked={onEmojiAdd} />
      <div className="notification-buttons-row">
        <button onClick={() => console.log('Rejected clicked')}>Reject</button>
        <button onClick={() => confirmWithCodeCheck(publicKey)}>Confirm</button>
        <p>{errorMessage}</p>
      </div>
    </div>
  );
};

import React, {useState} from 'react';
import {isValidCode} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {EmojiPlaceholders} from './EmojiPlaceholders';
import {EmojiPanelWithFakes} from './EmojiPanelWithFakes';
import {transactionDetails} from '../../core/constants/TransactionDetails';
import ProgressBar from '../commons/ProgressBar';
import {useProgressBar} from '../hooks/useProgressBar';


interface EmojiFormProps {
  sdk: UniversalLoginSDK;
  publicKey: string;
  contractAddress: string;
  privateKey: string;
}

export const EmojiForm = ({sdk, publicKey, contractAddress, privateKey}: EmojiFormProps) => {
  const [enteredCode, setEnteredCode] = useState([] as number[]);
  const [status, setStatus] = useState('');
  const {progressBar, showProgressBar} = useProgressBar();

  const EMOJIS_MAX_LENGTH = 6;

  const confirmWithCodeCheck = (publicKey: string) => {
    if (isValidCode(enteredCode, publicKey)) {
      sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails);
      showProgressBar();
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
    if (enteredCode.length === EMOJIS_MAX_LENGTH) {
      confirmWithCodeCheck(publicKey);
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
    {progressBar ?
      <ProgressBar className="connection-progress-bar" /> :
      <>
        <EmojiPlaceholders maxLength={EMOJIS_MAX_LENGTH} code={enteredCode} onEmojiClicked={onEmojiRemove} />
        <EmojiPanelWithFakes publicKey={publicKey} onEmojiClicked={onEmojiAdd} />
        <p className="emojis-form-status">{status}</p>
        <button className="emojis-form-reject" id="reject" onClick={() => sdk.denyRequest(contractAddress, publicKey, privateKey)}>Deny</button>
      </>
    }
    </div>
  );
};

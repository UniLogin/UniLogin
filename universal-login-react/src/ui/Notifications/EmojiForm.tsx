import React, {useState} from 'react';
import {isValidCode, SECURITY_CODE_LENGTH} from '@universal-login/commons';
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
  hideTitle?: () => void;
  className?: string;
}

export const EmojiForm = ({sdk, publicKey, contractAddress, privateKey, hideTitle, className}: EmojiFormProps) => {
  const [enteredCode, setEnteredCode] = useState([] as number[]);
  const [status, setStatus] = useState('');
  const {progressBar, showProgressBar} = useProgressBar();

  const confirmWithCodeCheck = (publicKey: string) => {
    if (isValidCode(enteredCode, publicKey)) {
      sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails);
      hideTitle ? hideTitle() : null;
      showProgressBar();
      setStatus('');
    } else {
      setStatus('Invalid code. Try again.');
    }
  };

  const onEmojiAdd = (code: number) => {
    if (enteredCode.length < SECURITY_CODE_LENGTH) {
      enteredCode.push(code);
      setEnteredCode([...enteredCode]);
    }
    if (enteredCode.length === SECURITY_CODE_LENGTH) {
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
      <div>
        <p className="approve-device-title">Connecting new device...</p>
        <ProgressBar className="connection-progress-bar" />
      </div> :
      <>
        <EmojiPlaceholders enteredCode={enteredCode} onEmojiClick={onEmojiRemove} className={className}/>
        <EmojiPanelWithFakes publicKey={publicKey} onEmojiClick={onEmojiAdd} className={className}/>
        <p className="emojis-form-status">{status}</p>
        <button className="emojis-form-reject" id="reject" onClick={() => sdk.denyRequest(contractAddress, publicKey, privateKey)}>Deny</button>
      </>
    }
    </div>
  );
};

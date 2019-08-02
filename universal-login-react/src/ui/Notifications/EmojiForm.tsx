import React, {useState} from 'react';
import {EmojiPlaceholders} from './EmojiPlaceholders';
import {EmojiPanelWithFakes} from './EmojiPanelWithFakes';
import {isValidCode, DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT, ETHER_NATIVE_TOKEN, Message, OPERATION_CALL} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';

export const transactionDetails: Message = {
  gasPrice: DEFAULT_GAS_PRICE,
  gasLimit: DEFAULT_GAS_LIMIT,
  gasToken: ETHER_NATIVE_TOKEN.address,
  operationType: OPERATION_CALL
};

interface EmojiFormProps {
  sdk: UniversalLoginSDK;
  publicKey: string;
  securityCodeWithFakes: number[];
  contractAddress: string;
  privateKey: string;
}

export const EmojiForm = ({sdk, publicKey, privateKey, contractAddress, securityCodeWithFakes}: EmojiFormProps) => {
  const [enteredCode, setEnteredCode] = useState([] as number[]);
  const [status, setStatus] = useState('');

  const confirmWithCodeCheck = (publicKey: string) => {
    if (isValidCode(enteredCode, publicKey)) {
      sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails);
      setStatus('OK: security code confirmed');
    } else {
      setStatus('FAIL: Wrong security code. Try again or deny request.');
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
        <button id="reject" onClick={() => sdk.denyRequest(contractAddress, publicKey, privateKey)}>Reject</button>
        <button id="confirm" onClick={() => confirmWithCodeCheck(publicKey)}>Confirm</button>
        <p>{status}</p>
      </div>
    </div>
  );
};

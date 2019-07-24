import React, {useState} from 'react';
import {Placeholders} from './Placeholders';
import {SecurityCodeWithFakes} from './SecurityCodeWithFakes';
import {isValidCode} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';

interface SecurityFormProps {
  sdk: UniversalLoginSDK;
  publicKey: string;
  securityCodeWithFakes: number[];
}

export const SecurityForm = ({sdk, publicKey, securityCodeWithFakes}: SecurityFormProps) => {
  const [enteredCode, setEnteredCode] = useState([] as number[]);
  const [errorMessage, setErrorMessage] = useState('');

  const confirmWithCodeCheck = (publicKey: string) => {
    if (isValidCode(enteredCode, publicKey)) {
      setErrorMessage('');
    } else {
      setErrorMessage('Wrong security code. Try again or deny request.');
    }
  };

  return (
    <div>
      <Placeholders code={enteredCode} setCode={setEnteredCode} />
      <SecurityCodeWithFakes securityCodeWithFakes={securityCodeWithFakes} code={enteredCode} setCode={setEnteredCode} />
      <div className="notification-buttons-row">
        <button onClick={() => console.log('rejecrted lcicked')} className="notification-reject-btn">Reject</button>
        <button onClick={() => confirmWithCodeCheck(publicKey)} className="btn btn-secondary btn-confirm">Confirm</button>
        <p>{errorMessage}</p>
      </div>
    </div>
  );
};

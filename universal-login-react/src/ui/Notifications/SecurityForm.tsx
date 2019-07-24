import React, {useState} from 'react';
import {Placeholders} from './Placeholders';
import {SecurityCodeWithFakes} from './SecurityCodeWithFakes';
import {isValidCode} from '@universal-login/commons';

interface SecurityFormProps {
  confirm: (key: string) => void;
  reject: (key: string) => void;
  publicKey: string;
}

export const SecurityForm = ({confirm, reject, publicKey}: SecurityFormProps) => {
  const [securityCode, setSecurityCode] = useState([0, 0, 0, 0, 0, 0]);
  const [errorMessage, setErrorMessage] = useState('');

  const confirmWithCodeCheck = (publicKey: string) => {
    if (isValidCode(securityCode, publicKey)) {
      confirm(publicKey);
    } else {
      setErrorMessage('Wrong security code. Try again or deny request.');
    }
  };

  return (
    <div>
      <Placeholders setSecurityCode={setSecurityCode} />
      <SecurityCodeWithFakes publicKey={publicKey} />
      <div className="notification-buttons-row">
        <button onClick={() => reject(publicKey)} className="notification-reject-btn">Reject</button>
        <button onClick={() => confirmWithCodeCheck(publicKey)} className="btn btn-secondary btn-confirm">Confirm</button>
        <p>{errorMessage}</p>
      </div>
    </div>
  );
};

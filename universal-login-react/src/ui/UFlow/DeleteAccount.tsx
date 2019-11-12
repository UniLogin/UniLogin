import React, {useState} from 'react';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {deleteAccount, getInputClassName} from '../../core/services/DeleteAccountService';
import {WalletService} from '@universal-login/sdk';
import './../styles/deleteAccount.sass';
import './../styles/deleteAccountDefault.sass';

export interface DeleteAccountProps {
  walletService: WalletService;
  onAccountDeleted: () => void;
  onDeletionProgress: (transactionHash?: string) => void;
  onCancelClick: () => void;
  className?: string;
}

export const DeleteAccount = ({walletService, onDeletionProgress, onAccountDeleted, onCancelClick, className}: DeleteAccountProps) => {
  const [inputs, setInputs] = useState({username: '', verifyField: ''});
  const [errors, setErrors] = useState({usernameError: false, verifyFieldError: false});

  function onDisconnectClick() {
    deleteAccount(walletService, inputs, setErrors, onDeletionProgress, onAccountDeleted);
  }

  return (
    <div className="universal-login-delete-account">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="delete-account">
          <h2 className="delete-account-title">Are you sure you want to disconnect this device? </h2>
          <p className="delete-account-subtitle">You will lost access to your funds from this device.</p>
          <div className="delete-account-form">
            <div className="delete-account-input-wrapper">
              <label htmlFor="username" className="delete-account-label">Type your username</label>
              <input
                id="username"
                className={getInputClassName(errors.usernameError)}
                type="text"
                value={inputs.username}
                onChange={e => {
                  setInputs({...inputs, username: e.target.value});
                  setErrors({...errors, usernameError: false});
                }}
                autoCapitalize='off'
              />
              {errors.usernameError && <div className="delete-account-hint">Wrong username</div>}
            </div>
            <div className="delete-account-input-wrapper">
              <label htmlFor="verifyField" className="delete-account-label">To verify, type <span><i>DELETE MY ACCOUNT</i></span> below:</label>
              <input
                id="verifyField"
                className={getInputClassName(errors.verifyFieldError)}
                type="text"
                value={inputs.verifyField}
                onChange={e => {
                  setInputs({...inputs, verifyField: e.target.value});
                  setErrors({...errors, verifyFieldError: false});
                }}
                autoCapitalize='off'
              />
              {errors.verifyFieldError && <div className="delete-account-hint">Wrong verify field</div>}
            </div>
          </div>
          <div className="delete-account-buttons">
            <button onClick={onCancelClick} className="delete-account-cancel">Cancel</button>
            <button onClick={onDisconnectClick} className="delete-account-confirm">Disconnect</button>
          </div>
        </div>
      </div>
    </div>
  );
};


interface HintProps {
  color: 'red' | 'yellow';
  children: string;
}

export const Hint = ({color, children}: HintProps) => {
  const [hintVisibility, setHintVisibility] = useState(true);

  if (hintVisibility) {
    return (
      <div className={`hint ${color}`}>
        <p className="hint-text">{children}</p>
        <button onClick={() => setHintVisibility(false)} className="hint-btn">Dismiss</button>
      </div>
    );
  }

  return null;
};

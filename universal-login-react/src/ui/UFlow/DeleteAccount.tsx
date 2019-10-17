import React, {useState} from 'react';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {deleteAccount, getInputClassName} from '../../core/services/DeleteAccountService';
import {WalletService} from '@universal-login/sdk';
import './../styles/deleteAccount.sass';
import './../styles/deleteAccountDefault.sass';

export interface DeleteAccountProps {
  walletService: WalletService;
  onDeleteAccountClick: () => void;
  onCancelClick: () => void;
  className?: string;
}

export const DeleteAccount = ({walletService, onDeleteAccountClick, onCancelClick, className}: DeleteAccountProps) => {
  const [inputs, setInputs] = useState({username: '', verifyField: ''});
  const [errors, setErrors] = useState({usernameError: false, verifyFieldError: false});

  return (
    <div className="universal-login-delete-account">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="delete-account">
          <h2 className="delete-account-title">Are you sure you want to delete your account? </h2>
          <p className="delete-account-subtitle">Deleting your account is permanent and will remove all content.</p>
          <div className="delete-account-form">
            <div className="delete-account-input-wrapper">
              <label htmlFor="username" className="delete-account-label">Type your username</label>
              <input
                id="username"
                className={getInputClassName(errors.usernameError)}
                type="text"
                value={inputs.username}
                onChange={e => setInputs({...inputs, username: e.target.value})}
              />
            </div>
            <div className="delete-account-input-wrapper">
              <label htmlFor="verifyField" className="delete-account-label">To verify, type <span><i>DELETE MY ACCOUNT</i></span> below:</label>
              <input
                id="verifyField"
                className={getInputClassName(errors.verifyFieldError)}
                type="text"
                value={inputs.verifyField}
                onChange={e => setInputs({...inputs, verifyField: e.target.value})}
              />
            </div>
          </div>
          <div className="delete-account-buttons">
            <button onClick={onCancelClick} className="delete-account-cancel">Cancel</button>
            <button onClick={() => deleteAccount(walletService, inputs, setErrors, onDeleteAccountClick)} className="delete-account-confirm">Delete account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

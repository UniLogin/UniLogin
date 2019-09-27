import React from 'react';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import './../styles/deleteAccount.sass';
import './../styles/deleteAccountDefault.sass';

export interface DeleteAccountProps {
  onCancelClick: () => void;
  onConfirmDeleteClick: () => void;
  className?: string;
}

export const DeleteAccount = ({onConfirmDeleteClick, onCancelClick, className}: DeleteAccountProps) => {
  return (
    <div className="universal-login-delete-account">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="delete-account">
          <h2 className="delete-account-title">Are you sure you want to delete your account? </h2>
          <p className="delete-account-subtitle">Deleting your account is permanent and will remove all content.</p>
          <div className="delete-account-form">
            <div className="delete-account-input-wrapper">
              <label htmlFor="username" className="delete-account-label">Type your username</label>
              <input id="username" className="delete-account-input" type="text"/>
            </div>
            <div className="delete-account-input-wrapper">
              <label htmlFor="verifyField" className="delete-account-label">To verify, type <span><i>DELETE MY ACCOUNT</i></span> below:</label>
              <input id="verifyField" className="delete-account-input" type="text"/>
            </div>
            <div className="delete-account-input-wrapper">
              <label htmlFor="userPassword" className="delete-account-label">Confirm your password:</label>
              <input id="userPassword" className="delete-account-input" type="password"/>
            </div>
          </div>
          <div className="delete-account-buttons">
            <button onClick={onCancelClick} className="delete-account-cancel">Cancel</button>
            <button onClick={onConfirmDeleteClick} className="delete-account-confirm">Delete account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

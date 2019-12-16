import React, {useState} from 'react';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {disconnectAccount, getInputClassName} from '../../core/services/DisconnectAccountService';
import {WalletService} from '@universal-login/sdk';
import './../styles/disconnectAccount.sass';
import './../styles/disconnectAccountDefault.sass';

export interface DisconnectAccountProps {
  walletService: WalletService;
  onAccountDisconnected: () => void;
  onDisconnectProgress: (transactionHash?: string) => void;
  onCancelClick: () => void;
  className?: string;
}

export const DisconnectAccount = ({walletService, onDisconnectProgress, onAccountDisconnected, onCancelClick, className}: DisconnectAccountProps) => {
  const [inputs, setInputs] = useState({username: '', verifyField: ''});
  const [errors, setErrors] = useState({usernameError: false, verifyFieldError: false});

  function onDisconnectClick() {
    disconnectAccount(walletService, inputs, setErrors, onDisconnectProgress, onAccountDisconnected);
  }

  return (
    <div className="universal-login-disconnect-account">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="disconnect-account">
          <h2 className="disconnect-account-title">Are you sure you want to disconnect this device? </h2>
          <p className="disconnect-account-subtitle">You will lose access to your funds from this device.</p>
          <div className="disconnect-account-form">
            <div className="disconnect-account-input-wrapper">
              <label htmlFor="username" className="disconnect-account-label">Type your username</label>
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
              {errors.usernameError && <div className="disconnect-account-hint">Wrong username</div>}
            </div>
            <div className="disconnect-account-input-wrapper">
              <label htmlFor="verifyField" className="disconnect-account-label">To verify, type <span><i>DISCONNECT</i></span> below:</label>
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
              {errors.verifyFieldError && <div className="disconnect-account-hint">Wrong verify field</div>}
            </div>
          </div>
          <div className="disconnect-account-buttons">
            <button onClick={onCancelClick} className="disconnect-account-cancel">Cancel</button>
            <button onClick={onDisconnectClick} className="disconnect-account-confirm">Disconnect</button>
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

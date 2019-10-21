import React, {useState} from 'react';
import Spinner from '../commons/Spinner';
import {WalletService} from '@universal-login/sdk';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import './../styles/connectPassphrase.sass';
import './../styles/connectPassphraseDefault.sass';

interface ConnectWithPassphraseProps {
  name: string;
  walletService: WalletService;
  onRecover: () => void;
  className?: string;
}

export const ConnectWithPassphrase = ({onRecover, name, walletService, className}: ConnectWithPassphraseProps) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onRecoveryClick = async () => {
    setIsLoading(true);
    try {
      await walletService.recover(name, code);
      onRecover();
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(e.message);
    }
  };

  return (
    <div className="universal-login-passphrase">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="connect-passphrase">
          <h1 className="connect-passphrase-title">Connect with passphrase</h1>
          <div className="connect-passphrase-content">
            <div className="connect-passphrase-section">
              <p className="connect-passphrase-text">Write your passphrase to recover the access to your account</p>
              <label className="connect-passphrase-label" htmlFor="passphrase-input">Backup codes</label>
              <input
                id="passphrase-input"
                className="connect-passphrase-input"
                value={code}
                onChange={event => setCode(event.target.value)}
                type="text"
              />
              {(errorMessage && !isLoading) && <div className="hint">{errorMessage}</div>}
            </div>
            <button onClick={onRecoveryClick} className="connect-passphrase-btn" disabled={!code || isLoading}>
              {isLoading
                ? <Spinner className="connect-spinner" dotClassName="connect-spinner-dot" />
                : 'Recover'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

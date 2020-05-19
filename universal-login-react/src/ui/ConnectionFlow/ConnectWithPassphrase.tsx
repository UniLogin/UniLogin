import React, {useState} from 'react';
import Spinner from '../commons/Spinner';
import {WalletService} from '@unilogin/sdk';
import {useThemeClassFor, classForComponent} from '../utils/classFor';
import './../styles/base/connectPassphrase.sass';
import './../styles/themes/Legacy/connectPassphraseThemeLegacy.sass';
import './../styles/themes/UniLogin/connectWithPassphraseThemeUniLogin.sass';

interface ConnectWithPassphraseProps {
  name: string;
  walletService: WalletService;
  onRecover: () => void;
  onCancel: () => void;
}

export const ConnectWithPassphrase = ({onRecover, name, walletService, onCancel}: ConnectWithPassphraseProps) => {
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
    <div className={`${useThemeClassFor()} ${classForComponent('passphrase')}`}>
      <div className="connect-passphrase">
        <h1 className="connect-passphrase-title">Connect with passphrase</h1>
        <div className="connect-passphrase-content">
          <div className="connect-passphrase-section">
            <p className="connect-passphrase-text">Write your passphrase to recover the access to your account</p>
            <label className="connect-passphrase-label" htmlFor="passphrase-input">Backup codes</label>
            <input
              id="passphrase-input"
              className="connect-passphrase-input"
              autoCorrect="off"
              autoCapitalize="off"
              autoComplete="off"
              spellCheck={false}
              value={code}
              onChange={event => setCode(event.target.value.toLowerCase().trim())}
              type="text"
            />
            {(errorMessage && !isLoading) && <div className="hint">{errorMessage}</div>}
          </div>
          <div className='connect-buttons-wrapper'>
            <button className="connect-cancel-button" onClick={onCancel}>Cancel</button>
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

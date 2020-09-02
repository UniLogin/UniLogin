import React, {useState} from 'react';
import {WalletService} from '@unilogin/sdk';
import '../styles/base/securityAlert.sass';
import '../styles/themes/Legacy/securityAlertThemeLegacy.sass';
import '../styles/themes/UniLogin/securityAlertThemeUniLogin.sass';
import '../styles/themes/Jarvis/securityAlertThemeJarvis.sass';
import {Spinner} from '../commons/Spinner';
import {ThemedComponent} from '../commons/ThemedComponent';

interface SecurityAlert {
  walletService: WalletService;
  onClick: () => void;
}

export const SecurityAlert = ({walletService, onClick}: SecurityAlert) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAlertClick = () => {
    setIsLoading(true);
    onClick();
  };

  return (walletService.state.kind !== 'Deployed'
    ? <ThemedComponent name="security-alert">
      <div className="security-alert-row">
        <div className="security-alert-description">
          <h3 className="security-alert-title">Secure your account with email and password</h3>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="security-alert-buttons-row">
            <button onClick={handleAlertClick} className="security-alert-button">Secure</button>
          </div>
        )}
      </div>
    </ThemedComponent>
    : null);
};

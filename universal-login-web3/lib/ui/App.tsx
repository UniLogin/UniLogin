import React from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {Onboarding} from '@universal-login/react';
import {ApplicationWallet} from '@universal-login/commons';

export interface AppProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  domains: string[];
}

export const App = ({sdk, walletService, domains}: AppProps) => (
  <div>
    <p style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>
      Create or connect account
    </p>
    <p style={{ color: 'white', fontSize: 15 }}>
      Type a nickname you want
    </p>
    <Onboarding
      sdk={sdk}
      walletService={walletService}
      domains={domains}
    />
  </div>
)


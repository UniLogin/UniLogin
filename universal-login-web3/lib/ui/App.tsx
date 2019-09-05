import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {Onboarding} from '@universal-login/react';
import {ApplicationWallet} from '@universal-login/commons';

export interface AppProps {
  sdk: UniversalLoginSDK;
  onCreate: (arg: ApplicationWallet) => void;
  domains: string[];
}

export const App = ({sdk, onCreate, domains}: AppProps) => (
  <div>
    <p style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>
      Create or connect account
    </p>
    <p style={{ color: 'white', fontSize: 15 }}>
      Type a nickname you want
    </p>
    <Onboarding
      sdk={sdk}
      onConnect={() => {}}
      onCreate={onCreate}
      domains={domains}
    />
  </div>
)


import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {WalletSelector} from '.';
import {SecurityForm} from './ui/Notifications/SecurityForm';
import {TEST_ACCOUNT_ADDRESS, generateCode, generateCodeWithFakes} from '@universal-login/commons';
import {SecurityCode} from './ui/WalletSelector/SecurityCode';

export const App = () => {
  const sdk = new UniversalLoginSDK('http://localhost:3311', 'http://localhost:18545');
  const splitStyle = {
    height: '500px',
    padding: '20px'
  };

  const top = {
    left: '0',
    backgroundColor: '#e3d3c2',
    display: 'flex',
    paddingTop: '100px',
    justifyContent: 'center',
  };

  const bottom = {
    right: '0',
    backgroundColor: '#91a3f5'
  };

  const securityCode = generateCode(TEST_ACCOUNT_ADDRESS);
  const securityCodeWithFakes = generateCodeWithFakes(TEST_ACCOUNT_ADDRESS);

  return (
    <div>
      <div style={{...splitStyle, ...top}}>
        <div style={{maxWidth: '400px', width: '100%'}}>
          <p>WalletSelector</p>
          <WalletSelector
            onCreateClick={() => { console.log('create'); }}
            onConnectionClick={() => { console.log('connect'); }}
            sdk={sdk}
            domains={['mylogin.eth']}
          />
          <SecurityCode code={securityCode}/>
        </div>
      </div>

      <div style={{...splitStyle, ...bottom}}>
        <p>Notifications</p>
        <SecurityForm
          sdk={sdk}
          publicKey={TEST_ACCOUNT_ADDRESS}
          securityCodeWithFakes={securityCodeWithFakes}
        />
      </div>
    </div>
  );
};

export default App;

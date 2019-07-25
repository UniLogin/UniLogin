import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {WalletSelector} from '.';
import {EmojiForm} from './ui/Notifications/EmojiForm';
import {TEST_ACCOUNT_ADDRESS, generateCode, generateCodeWithFakes} from '@universal-login/commons';
import {EmojiPanel} from './ui/WalletSelector/EmojiPanel';
import {TopUp} from './ui/TopUp/TopUp';

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
          <EmojiPanel code={securityCode}/>
        </div>
      </div>

      <div style={{...splitStyle, ...bottom}}>
        <p>Notifications</p>
        <EmojiForm
          sdk={sdk}
          publicKey={TEST_ACCOUNT_ADDRESS}
          securityCodeWithFakes={securityCodeWithFakes}
        />
      </div>
      <TopUp
        contractAddress={TEST_ACCOUNT_ADDRESS}
        onRampConfig={{safello: {
          appId: '1234-5678',
          baseAddress: 'https://app.s4f3.io/sdk/quickbuy.html',
          addressHelper: true
        }}}
      />
    </div>
  );
};

export default App;

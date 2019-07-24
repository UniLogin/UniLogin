import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {WalletSelector} from '.';

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
        </div>
      </div>

      <div style={{...splitStyle, ...bottom}}>
        <p>Notifications</p>
      </div>
    </div>
  );
};

export default App;

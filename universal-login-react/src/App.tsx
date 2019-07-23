import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {WalletSelector} from '.';

export const App = () => {
  const sdk = new UniversalLoginSDK('http://localhost:3311', 'http://localhost:18545');
  const splitStyle = {
    height: '100%',
    width: '50%',
    position: 'fixed' as 'fixed',
    paddingTop: '20px'
  };

  const left = {
    left: '0',
    backgroundColor: '#e3d3c2'
  };

  const right = {
    right: '0',
    backgroundColor: '#91a3f5'
  };

  const centered = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as 'center'
  };


  return (
    <div>
      <div style={{...splitStyle, ...left}}>
        <div style={centered}>
          <p>WalletSelector</p>
          <WalletSelector
            onCreateClick={() => {console.log('create')}}
            onConnectionClick={() => {console.log('connect')}}
            sdk={sdk}
            domains={['mylogin.eth']}/>
        </div>
      </div>

      <div style={{...splitStyle, ...right}}>
        <div style={centered}>
          <p>Notifications</p>
        </div>
      </div>
    </div>
  );
};

export default App;

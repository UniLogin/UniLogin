// import UniversalLoginSDK from '@universal-login/sdk';
import React from 'react';

export const App = () => {

  // const sdk = new UniversalLoginSDK();
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
    textAlign: 'center' as 'center'
  };


  return (
    <div>
      <div style={{...splitStyle, ...left}}>
        <div style={centered}>
          <p>WalletSelector</p>
          {/* <WalletSelector sdk={sdk}/> */}
        </div>
      </div>

      <div style={{...splitStyle, ...right}}>
        <div style={centered}>
          <p>Notifications</p>
          {/* <Notifications sdk={sdk}/> */}
        </div>
      </div>
    </div>
  );
};

export default App;

import React from 'react';
import Web3 from 'web3';
import {ULWeb3Provider} from '@universal-login/web3';

const web3 = new Web3(new ULWeb3Provider(new Web3.providers.HttpProvider('https://rinkeby.infura.io')));

web3.eth.getAccounts().then(accounts => console.log('accounts', accounts));

function App() {
  function sendTx() {
    web3.eth.sendTransaction({
      from: '0x2bc65e3Bb5D6bAbd6342489aacFecCaB64167835',
      to: '0x7ffC57839B00206D1ad20c69A1981b489f772031',
      value: '500000000000000',
    }).then(console.log);
  }

  return (
    <div>
      Hello from host app!
      <button onClick={sendTx}>Send TX</button>
    </div>
  );
}

export default App;

import React from 'react';
import Web3 from 'web3';
import {ULWeb3Provider} from '@universal-login/web3';

const config = {
  relayerUrl: process.env.RELAYER_URL!,
  jsonRpcURl: process.env.JSON_RPC_URL!,
  ensDomains: [process.env.ENS_DOMAIN_1!],
}

console.log(config);

const universalLogin = new ULWeb3Provider(
  new Web3.providers.HttpProvider(config.jsonRpcURl),
  config.relayerUrl,
  config.ensDomains,
);
const web3 = new Web3(universalLogin);

web3.eth.getAccounts()
  .then(accounts => console.log('accounts', accounts))
  .catch(console.error);

function App() {
  function sendTx() {
    web3.eth.sendTransaction({
      from: '0x0000000000000000000000000000000000000000',
      to: '0x7ffC57839B00206D1ad20c69A1981b489f772031',
      value: '500000000000000',
    })
      .then(console.log)
      .catch(console.error);
  }

  function create() {
    universalLogin.create();
  }

  return (
    <div>
      Hello from host app!
      <button onClick={sendTx}>Send TX</button>
      <button onClick={create}>Create wallet</button>
    </div>
  );
}

export default App;

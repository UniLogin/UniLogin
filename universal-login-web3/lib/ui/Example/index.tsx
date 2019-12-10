import React, {useRef} from 'react';
import Web3 from 'web3';
import ReactDOM from 'react-dom';
import {ULWeb3Provider} from '../../ULWeb3Provider';

const config = {
  relayerUrl: process.env.RELAYER_URL!,
  jsonRpcURl: process.env.JSON_RPC_URL!,
  ensDomains: [process.env.ENS_DOMAIN_1!],
};

const universalLogin = ULWeb3Provider.getDefaultProvider({
  ...config,
  provider: new Web3.providers.HttpProvider(config.jsonRpcURl),
});
const web3 = new Web3(universalLogin);

function App() {
  const ulButton = useRef<HTMLDivElement | null>(null);

  async function sendTx() {
    try {
      const res = await web3.eth.sendTransaction({
        from: (await web3.eth.getAccounts())[0],
        to: '0x7ffC57839B00206D1ad20c69A1981b489f772031',
        value: '500000000000000',
      });
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  }

  async function create() {
    await universalLogin.create();
    universalLogin.initWeb3Button(ulButton.current!);
  }

  return (
    <div>
      Hello from host app!
      <button onClick={sendTx}>Send TX</button>
      <button onClick={create}>Create wallet</button>
      <div ref={ref => {ulButton.current = ref;}} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

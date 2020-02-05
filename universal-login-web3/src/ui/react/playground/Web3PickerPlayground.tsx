import React, {useState} from 'react';
import {UniLogin} from '../../../api/UniLogin';
import Web3 from 'web3';

export const Web3PickerPlayground = () => {
  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:18545'));
  const [web3Strategy] = useState(UniLogin.setupWeb3Picker(web3, ['UniLogin', 'Metamask']));
  const [providerName, setSetProviderName] = useState<string>(web3Strategy.providerName);

  const onClick = async () => {
    console.log('clicked button');
    await web3Strategy.send({method: 'eth_sign'} as any, () => {});
    console.log('Picked');
    setSetProviderName(web3Strategy.providerName);
  };
  return (
    <div className="web3-picker-playground">
      <button id="test-button" onClick={onClick}>Show chooser</button>
      <br />
      CurrentProvider: {providerName}
    </div>
  );
};

import React, {useState} from 'react';
import Web3 from 'web3';
import {getApplicationInfoFromDocument} from '../../utils/applicationInfo';
import {setupStrategies} from '../../../services/setupStrategies';
import {Web3PickerProvider} from '../../../Web3PickerProvider';

export const Web3PickerPlayground = () => {
  const [web3Strategy] = useState(() => {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:18545'));
    const applicationInfo = getApplicationInfoFromDocument();
    const web3ProviderFactories = setupStrategies(web3.currentProvider, ['UniLogin', 'Metamask'], {applicationInfo});
    const web3PickerProvider = new Web3PickerProvider(web3ProviderFactories, web3.currentProvider);
    web3.setProvider(web3PickerProvider);
    return web3PickerProvider;
  });
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

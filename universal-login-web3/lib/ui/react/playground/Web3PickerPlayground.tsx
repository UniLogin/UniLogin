import React, {useState} from 'react';
import {Provider} from 'web3/providers';
import {universalLoginProviderFactory} from '../../../constants/universalLoginProviderFactory';
import {Web3Strategy} from '../../../Web3Strategy';

export const Web3PickerPlayground = () => {
  const [web3Strategy] = useState(() => new Web3Strategy([
    universalLoginProviderFactory,
  ],
  {} as Provider,
  ));
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

import React, {useState} from 'react';
import {universalLoginProviderFactory} from '../../../Web3ProviderFactory';
import {Web3Strategy} from '../../../Web3Strategy';
import {Provider} from 'web3/providers';

export const Web3PickerPlayground = () => {
  const [web3Strategy] = useState(() => new Web3Strategy([
    universalLoginProviderFactory,
  ]));
  const [currentProvider, setCurrentProvider] = useState<Provider>(web3Strategy.currentProvider);

  const onClick = async () => {
    console.log('clicked button');
    await web3Strategy.send({} as any, {} as any);
    console.log('Picked');
    setCurrentProvider(web3Strategy.currentProvider);
  };
  return (
    <div className="web3-picker-playground">
      <button id="test-button" onClick={onClick}>Show chooser</button>
      <br />
      CurrentProvider: {currentProvider?.toString()}
    </div>
  );
};

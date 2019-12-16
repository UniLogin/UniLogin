import React, {useState} from 'react';
import {Provider} from 'web3/providers';
import {universalLoginProviderFactory} from '../../../constants/universalLoginProviderFactory';
import {Web3Strategy} from '../../../Web3Strategy';

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

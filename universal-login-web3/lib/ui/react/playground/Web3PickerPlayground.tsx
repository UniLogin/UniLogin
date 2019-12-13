import React, {useState} from 'react';
import {Web3Picker, Web3ProviderFactory} from '../Web3Picker';
import {getConfigForNetwork} from '../../../config';

interface Web3PickerPlaygroundProps {
  web3Picker?: Web3Picker;
}

export const Web3PickerPlayground = () => {
  const [currentProvider, setCurrentProvider] = useState<Web3ProviderFactory | undefined>(undefined);
  const {provider} = getConfigForNetwork('kovan')
  const [web3Picker] = useState(() => new Web3Picker(provider));
  web3Picker.setOnPickProvider(setCurrentProvider);

  const onClick = async () => {
    console.log('clicked button')
    const {waitForPick} = web3Picker.show();
    console.log('executed show')
    await waitForPick();
    console.log('Picked')
  }
  return (
    <div className="web3-picker-playground">
      <button id="test-button" onClick={onClick}>Show chooser</button>
      <br />
      CurrentProvider: {currentProvider?.name}
    </div>
  );
};

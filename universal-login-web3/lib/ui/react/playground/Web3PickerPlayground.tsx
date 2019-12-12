import React, {useState} from 'react';
import {Web3Picker, CustomProvider} from '../Web3Picker';

interface Web3PickerPlaygroundProps {
  web3Picker?: Web3Picker;
}

export const Web3PickerPlayground = () => {
  const [currentProvider, setCurrentProvider] = useState<CustomProvider | undefined>(undefined);
  const [web3Picker] = useState(() => new Web3Picker(setCurrentProvider));
  return (
    <div className="web3-picker-playground">
      <button id="test-button" onClick={() => web3Picker.show()}>Show chooser</button>
      <br />
      CurrentProvider: {currentProvider?.name}
    </div>
  );
};

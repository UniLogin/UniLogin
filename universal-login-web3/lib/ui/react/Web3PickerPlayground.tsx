import React from 'react';
import {Web3Picker} from './Web3Picker';

interface Web3PickerPlaygroundProps {
  web3Picker?: Web3Picker;
}

export const Web3PickerPlayground = ({web3Picker = new Web3Picker()}: Web3PickerPlaygroundProps) => {
  return (
    <div className="web3-picker-playground">
      <button id="test-button" onClick={() => web3Picker.show()}>Show chooser</button>
    </div>
  )
};

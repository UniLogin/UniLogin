import React from 'react';
import {utils} from 'ethers';
import {GasMode} from '@universal-login/commons';
import {RadioButton} from './RadioButton';

interface GasPriceSpeedProps {
  gasModes: GasMode[];
  modeName: string;
  onModeChanged: (name: string, usdAmount: utils.BigNumberish) => void;
}

export const GasPriceSpeedChoose = ({gasModes, modeName, onModeChanged}: GasPriceSpeedProps) => (
  <div className="transaction-speed">
    <p className="transaction-speed-title">Transaction speed</p>
    <ul className="transaction-speed-list">
      {gasModes.map(({name, usdAmount}) => (
        <li key={name} className="transaction-speed-item">
          <RadioButton
            id={name}
            name="speed"
            checked={name === modeName}
            onChange={() => onModeChanged(name, usdAmount)}
          >
            <div className="transaction-speed-block">
              <p className="transaction-speed-type">{name}</p>
            </div>
          </RadioButton>
        </li>
      ))}
    </ul>
  </div>
);

import React, { ReactNode, useState } from 'react';
import './../styles/gasPrice.sass';
import './../styles/gasPriceDefault.sass';

interface GasPriceProps {
  gasTokenAddress: string;
  setGasTokenAddress: (gasTokenAddress: string) => void;
  gasModeName: string;
  setGasModeName: (gasModeName: string) => void;
  gasModes: any;
}

export const GasPrice = ({setGasModeName, setGasTokenAddress, gasModeName, gasTokenAddress}: GasPriceProps) => {
  const [contentVisibility, setContentVisibility] = useState(false);

  return (
    <div className="gas-price">
      <GasPriceTitle />
      <div className="gas-price-dropdown">
        <div className="gas-price-selected">
          <div className="gas-price-selected-row">
            <div>
              <div className="transaction-fee-details">
                <img src="" alt="" className="transaction-fee-item-icon"/>
                <div>
                  <p className="transaction-fee-amount">0.09 DAI</p>
                  <p className="transaction-fee-amount-usd">0.09 USD</p>
                </div>
              </div>
            </div>
            <hr className="gas-price-selected-divider" />
            <div>
              <p className="transaction-speed-type">Fast</p>
            </div>
          </div>
          <button className="gas-price-btn" onClick={() => setContentVisibility(!contentVisibility)} />
        </div>
        {contentVisibility &&
          <div className="gas-price-selector">
            <GasPriceTitle />
            <div className="transaction-speed">
              <p className="transaction-speed-title">Transaction speed</p>
              <ul className="transaction-speed-list">
                <li className="transaction-speed-item">
                  <RadioButton
                    id="cheap"
                    name="speed"
                    checked={gasModeName === 'cheap'}
                    onChange={() => setGasModeName('cheap')}
                  >
                    <div className="transaction-speed-block">
                      <p className="transaction-speed-type">Cheap</p>
                    </div>
                  </RadioButton>
                </li>
                <li className="transaction-speed-item">
                  <RadioButton
                    id="fast"
                    name="speed"
                    checked={gasModeName === 'fast'}
                    onChange={() => setGasModeName('fast')}
                  >
                    <div className="transaction-speed-block">
                      <p className="transaction-speed-type">Fast</p>
                    </div>
                  </RadioButton>
                </li>
              </ul>
            </div>
            <div className="transaction-fee">
              <p className="transaction-fee-title">Transaction fee</p>
              <ul className="transaction-fee-list">
                <li className="transaction-fee-item">
                  <RadioButton
                    id={'token-0x'}
                    name="fee"
                    checked={gasTokenAddress !== '0x0000000000000000000000000000000000000000'}
                    onChange={() => setGasTokenAddress('none')}
                  >
                    <div className="transaction-fee-row">
                      <div className="transaction-fee-details">
                        <img src="" alt="" className="transaction-fee-item-icon"/>
                        <div>
                          <p className="transaction-fee-amount">0.09 DAI</p>
                          <p className="transaction-fee-amount-usd">0.09 USD</p>
                        </div>
                      </div>
                      <div className="transaction-fee-balance">
                        <p className="transaction-fee-balance-text">Your balance</p>
                        <p className="transaction-fee-balance-amount">250 DAI</p>
                      </div>
                    </div>
                  </RadioButton>
                </li>
                <li className="transaction-fee-item">
                  <RadioButton
                    id={'token-0x0000000000000000000000000000000000000000'}
                    name="fee"
                    checked={gasTokenAddress === '0x0000000000000000000000000000000000000000'}
                    onChange={() => setGasTokenAddress('0x0000000000000000000000000000000000000000')}
                  >
                    <div className="transaction-fee-row">
                      <div className="transaction-fee-details">
                        <img src="" alt="" className="transaction-fee-item-icon"/>
                        <div>
                          <p className="transaction-fee-amount">0.09 ETH</p>
                          <p className="transaction-fee-amount-usd">0.09 USD</p>
                        </div>
                      </div>
                      <div className="transaction-fee-balance">
                        <p className="transaction-fee-balance-text">Your balance</p>
                        <p className="transaction-fee-balance-amount">20 ETH</p>
                      </div>
                    </div>
                  </RadioButton>
                </li>
              </ul>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

const GasPriceTitle = () => (
  <div className="gas-price-top">
    <p className="gas-price-title">Transaction details</p>
    <div className="gas-price-hint">
      <p className="gas-price-tooltip">Choose transaction speed and token</p>
    </div>
  </div>
);

interface RadioButtonProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}

const RadioButton = ({id, name, checked, onChange, children}: RadioButtonProps) => (
  <label className="gas-price-label">
    <input id={id} checked={checked} onChange={onChange} type="radio" name={name} className="gas-price-radio"/>
    <div className="gas-price-radio-custom">
      {children}
    </div>
  </label>
);

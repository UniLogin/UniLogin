import React, { ReactNode, useState } from 'react';
import './../styles/gasPrice.sass';
import './../styles/gasPriceDefault.sass';

export const GasPrice = () => {
  const [contentVisibility, setContentVisibility] = useState(false);
  const [speedType, setSpeedType] = useState('cheap');
  const [fee, setFee] = useState('dai');

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
                    name="speed"
                    checked={speedType === 'cheap'}
                    onChange={() => setSpeedType('cheap')}
                  >
                    <div className="transaction-speed-block">
                      <p className="transaction-speed-type">Cheap</p>
                    </div>
                  </RadioButton>
                </li>
                <li className="transaction-speed-item">
                  <RadioButton
                    name="speed"
                    checked={speedType === 'fast'}
                    onChange={() => setSpeedType('fast')}
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
                    name="fee"
                    checked={fee === 'dai'}
                    onChange={() => setFee('dai')}
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
                    name="fee"
                    checked={fee === 'eth'}
                    onChange={() => setFee('eth')}
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
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}

const RadioButton = ({name, checked, onChange, children}: RadioButtonProps) => (
  <label className="gas-price-label">
    <input checked={checked} onChange={onChange} type="radio" name={name} className="gas-price-radio"/>
    <div className="gas-price-radio-custom">
      {children}
    </div>
  </label>
);

import React, {ReactNode, useState, useEffect} from 'react';
import './../styles/gasPrice.sass';
import './../styles/gasPriceDefault.sass';
import UniversalLoginSDK from '@universal-login/sdk';
import {utils} from 'ethers';
import {useAsync} from '../hooks/useAsync';
import {getGasPriceFor, GasMode} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';


interface GasPriceProps {
  sdk: UniversalLoginSDK;
  setGasTokenAddress: (gasTokenAddress: string) => void;
  setGasPrice: (gasModeName: utils.BigNumber) => void;
  className?: string;
}

export const GasPrice = ({sdk, setGasTokenAddress, setGasPrice, className}: GasPriceProps) => {
  const [gasModes] = useAsync(() => sdk.getGasModes(), []);
  const [modeName, setModeName] = useState<string>('');
  const [tokenAddress, setTokenAddress] = useState<string>('');

  const onModeChanged = (name: string) => {
    setModeName(name);
    setGasPrice(getGasPriceFor(gasModes!, name, tokenAddress));
  };

  const onTokenChanged = (address: string, gasPrice: utils.BigNumber) => {
    setTokenAddress(address);
    setGasTokenAddress(address);
    setGasPrice(gasPrice);
  };

  useEffect(() => {
    if (gasModes) {
      const name = gasModes[0].name;
      const address = gasModes[0].gasOptions[0].token.address;
      const gasPrice = getGasPriceFor(gasModes, name, address);
      setModeName(name);
      onTokenChanged(address, gasPrice);
    }
  }, [gasModes]);
  const [contentVisibility, setContentVisibility] = useState(false);

  const formatWeiToEther = (wei: utils.BigNumber) => wei.div('1000000000').toNumber() / 1000000000;

  const renderComponent = (gasModes: GasMode[]) => (
    <div className="universal-login-gas">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="gas-price">
          <GasPriceTitle />
          <div className="gas-price-dropdown">
            <div className="gas-price-selected">
              <div className="gas-price-selected-row">
                <div>
                  <div className="transaction-fee-details">
                    <img src="" alt="" className="transaction-fee-item-icon" />
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
                        {gasModes.map(({name}) => (
                          <li key={name} className="transaction-speed-item">
                            <RadioButton
                              id={name}
                              name="speed"
                              checked={name === modeName}
                              onChange={() => onModeChanged(name)}
                            >
                              <div className="transaction-speed-block">
                                <p className="transaction-speed-type">{name}</p>
                              </div>
                            </RadioButton>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="transaction-fee">
                      <p className="transaction-fee-title">Transaction fee</p>
                      <ul className="transaction-fee-list">
                        {gasModes.filter(gasMode => gasMode.name === modeName)[0].gasOptions.map(({token, gasPrice}) => (
                          <li key={token.address} className="transaction-fee-item">
                            <RadioButton
                              id={`token-${token.address}`}
                              name="fee"
                              checked={token.address === tokenAddress}
                              onChange={() => onTokenChanged(token.address, gasPrice)}
                            >
                              <div className="transaction-fee-row">
                                <div className="transaction-fee-details">
                                  <img src="" alt="" className="transaction-fee-item-icon" />
                                  <div>
                                    <p className="transaction-fee-amount">{formatWeiToEther(gasPrice)} {token.symbol}</p>
                                    <p className="transaction-fee-amount-usd">0.09 USD</p>
                                  </div>
                                </div>
                                <div className="transaction-fee-balance">
                                  <p className="transaction-fee-balance-text">Your balance</p>
                                  <p className="transaction-fee-balance-amount">250 {token.symbol}</p>
                                </div>
                              </div>
                            </RadioButton>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    gasModes ? renderComponent(gasModes) : <div>Loading</div>
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
    <input id={id} checked={checked} onChange={onChange} type="radio" name={name} className="gas-price-radio" />
    <div className="gas-price-radio-custom">
      {children}
    </div>
  </label>
);

import React, {ReactNode, useState, useEffect} from 'react';
import './../styles/gasPrice.sass';
import './../styles/gasPriceDefault.sass';
import {DeployedWallet} from '@universal-login/sdk';
import {utils} from 'ethers';
import {useAsync} from '../hooks/useAsync';
import {getGasPriceFor, GasMode, GasParameters} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

interface GasPriceProps {
  deployedWallet: DeployedWallet;
  onGasParametersChanged: (gasParameters: GasParameters) => void;
  className?: string;
}

export const GasPrice = ({deployedWallet, onGasParametersChanged, className}: GasPriceProps) => {
  const [gasModes] = useAsync<GasMode[]>(() => deployedWallet.getGasModes(), []);
  const [modeName, setModeName] = useState<string>('');
  const [usdAmount, setUsdAmount] = useState<utils.BigNumberish>('');
  const [tokenAddress, setTokenAddress] = useState<string>('');

  const onModeChanged = (name: string, usdAmount: utils.BigNumberish) => {
    setModeName(name);
    setUsdAmount(usdAmount);
    onGasParametersChanged({
      gasPrice: getGasPriceFor(gasModes!, name, tokenAddress),
      gasToken: tokenAddress
    });
  };

  const onTokenChanged = (address: string, gasPrice: utils.BigNumber) => {
    setTokenAddress(address);
    onGasParametersChanged({
      gasPrice,
      gasToken: address
    });
  };

  useEffect(() => {
    if (gasModes) {
      const {name, usdAmount} = gasModes[0];
      const address = gasModes[0].gasOptions[0].token.address;
      const gasPrice = getGasPriceFor(gasModes, name, address);
      setUsdAmount(usdAmount);
      setModeName(name);
      onTokenChanged(address, gasPrice);
    }
  }, [gasModes]);
  const [contentVisibility, setContentVisibility] = useState(false);

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
                    <div>
                      <p className="transaction-fee-amount">{usdAmount} DAI</p>
                      <p className="transaction-fee-amount-usd">{usdAmount} USD</p>
                    </div>
                  </div>
                </div>
                <hr className="gas-price-selected-divider" />
                <div>
                  <p className="transaction-speed-type">{modeName}</p>
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
                                <p className="transaction-fee-amount">{utils.formatEther(gasPrice)} {token.symbol}</p>
                                <p className="transaction-fee-amount-usd">{usdAmount} USD</p>
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

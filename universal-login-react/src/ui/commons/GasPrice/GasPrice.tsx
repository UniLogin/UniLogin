import React, {useState, useEffect} from 'react';
import './../../styles/gasPrice.sass';
import './../../styles/gasPriceDefault.sass';
import {DeployedWallet} from '@universal-login/sdk';
import {utils} from 'ethers';
import {useAsync} from '../../hooks/useAsync';
import {GasMode, GasParameters, GasOption, TokenDetailsWithBalance, getBalanceOf, EMPTY_GAS_OPTION, safeMultiply} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import {findGasMode, findGasOption} from '@universal-login/commons/dist/lib/core/utils/gasPriceMode';
import {useAsyncEffect} from '../../hooks/useAsyncEffect';
import {GasPriceSpeedChoose} from './GasPriceSpeed';
import {TransactionFeeChoose} from './TransactionFeeChoose';

interface GasPriceProps {
  deployedWallet: DeployedWallet;
  gasLimit: utils.BigNumberish;
  onGasParametersChanged: (gasParameters: GasParameters) => void;
  className?: string;
}

export const GasPrice = ({deployedWallet, gasLimit, onGasParametersChanged, className}: GasPriceProps) => {
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);

  useAsyncEffect(() => deployedWallet.subscribeToBalances(setTokenDetailsWithBalance), []);

  const [gasModes] = useAsync<GasMode[]>(() => deployedWallet.getGasModes(), []);
  const [modeName, setModeName] = useState<string>('');
  const [usdAmount, setUsdAmount] = useState<utils.BigNumberish>('0');
  const [gasOption, setGasOption] = useState<GasOption>(EMPTY_GAS_OPTION);

  const onModeChanged = (name: string, usdAmount: utils.BigNumberish) => {
    const gasTokenAddress = gasOption.token.address;
    const gasOptions = findGasMode(gasModes!, name).gasOptions;

    setModeName(name);
    setUsdAmount(usdAmount);
    onGasOptionChanged(findGasOption(gasOptions, gasTokenAddress));
  };

  const onGasOptionChanged = (gasOption: GasOption) => {
    setGasOption(gasOption);
    onGasParametersChanged({
      gasPrice: gasOption.gasPrice,
      gasToken: gasOption.token.address
    });
  };

  useEffect(() => {
    if (gasModes) {
      const {name, usdAmount} = gasModes[0];
      const gasOption = gasModes[0].gasOptions[0];
      setUsdAmount(usdAmount);
      setModeName(name);
      onGasOptionChanged(gasOption);
    }
  }, [gasModes]);
  const [contentVisibility, setContentVisibility] = useState(false);

  const multiplyWithGasLimit = (number: utils.BigNumber) => safeMultiply(number, gasLimit);

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
                      <p className="transaction-fee-amount">{multiplyWithGasLimit(gasOption.gasPrice)} {gasOption.token.symbol}</p>
                      <p className="transaction-fee-amount-usd">{multiplyWithGasLimit(utils.parseEther(usdAmount.toString()))} USD</p>
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
                <GasPriceSpeedChoose
                  gasModes={gasModes}
                  modeName={modeName}
                  onModeChanged={onModeChanged}
                />
                <TransactionFeeChoose
                  gasModes={gasModes}
                  modeName={modeName}
                  tokenAddress={gasOption.token.address}
                  gasLimit={gasLimit}
                  usdAmount={usdAmount}
                  tokensDetailsWithBalance={tokenDetailsWithBalance}
                  onGasOptionChanged={onGasOptionChanged}
                />
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


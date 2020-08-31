import React, {useState, useEffect, useRef} from 'react';
import './../../styles/base/gasPrice.sass';
import './../../styles/themes/Legacy/gasPriceThemeLegacy.sass';
import './../../styles/themes/UniLogin/gasPriceThemeUniLogin.sass';
import './../../styles/themes/Jarvis/gasPriceThemeJarvis.sass';
import UniLoginSdk, {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import {utils} from 'ethers';
import {useAsync} from '../../hooks/useAsync';
import {GasMode, GasOption, TokenDetailsWithBalance, EMPTY_GAS_OPTION, ensureNotFalsy, OnGasParametersChanged, ETHER_NATIVE_TOKEN, findGasMode, findGasOption, FAST_GAS_MODE_INDEX} from '@unilogin/commons';
import {useAsyncEffect} from '../../hooks/useAsyncEffect';
import {GasPriceSpeedChoose} from './GasPriceSpeed';
import {TransactionFeeChoose} from './TransactionFeeChoose';
import {SelectedGasPrice} from './SelectedGasPrice';
import {useOutsideClick} from '../../hooks/useClickOutside';
import {Spinner} from '../Spinner';
import {useClassFor} from '../../utils/classFor';
import {NoRefundGasPrice} from './NoRefundGasPrice';

export interface GasPriceProps {
  deployedWallet?: DeployedWithoutEmailWallet;
  sdk: UniLoginSdk;
  isDeployed: boolean;
  gasLimit?: utils.BigNumberish;
  onGasParametersChanged: OnGasParametersChanged;
}

export const GasPriceWithOptions = ({isDeployed = true, deployedWallet, sdk, gasLimit, onGasParametersChanged}: GasPriceProps) => {
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);

  useAsyncEffect(async () => {
    if (isDeployed) {
      ensureNotFalsy(deployedWallet, Error, 'Missing parameter: deployedWallet');
      return deployedWallet.subscribeToBalances(setTokenDetailsWithBalance);
    } else {
      ensureNotFalsy(sdk, Error, 'Missing parameter: sdk');
    }
  }, [isDeployed, deployedWallet]);

  const [gasModes] = useAsync<GasMode[]>(() => isDeployed ? deployedWallet!.getGasModes() : sdk!.getGasModes(), []);
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
      gasToken: gasOption.token.address,
    });
  };

  const [contentVisibility, setContentVisibility] = useState(false);

  const onGasOptionSelected = (gasOption: GasOption) => {
    onGasOptionChanged(gasOption);
    setContentVisibility(!contentVisibility);
  };

  useEffect(() => {
    if (gasModes) {
      const {name, usdAmount} = gasModes[FAST_GAS_MODE_INDEX];
      const gasOption = findGasOption(gasModes[FAST_GAS_MODE_INDEX].gasOptions, ETHER_NATIVE_TOKEN.address);
      setUsdAmount(usdAmount);
      setModeName(name);
      onGasOptionChanged(gasOption);
    }
  }, [gasModes]);

  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => {
    if (contentVisibility) {
      setContentVisibility(false);
    }
  }, [contentVisibility]);

  const renderComponent = (gasModes: GasMode[]) => (
    <>
      <GasPriceTitle />
      <div className="gas-price-dropdown">
        <SelectedGasPrice
          modeName={modeName}
          gasLimit={gasLimit}
          usdAmount={usdAmount}
          gasOption={gasOption}
          onClick={() => setContentVisibility(!contentVisibility)}
        />
        {contentVisibility &&
          <div className="gas-price-selector">
            <GasPriceTitle />
            <GasPriceSpeedChoose
              gasModes={gasModes}
              modeName={modeName}
              onModeChanged={onModeChanged}
            />
            {gasLimit ? <TransactionFeeChoose
              gasModes={gasModes}
              modeName={modeName}
              tokenAddress={gasOption.token.address}
              gasLimit={gasLimit}
              usdAmount={usdAmount}
              tokensDetailsWithBalance={tokenDetailsWithBalance}
              onGasOptionChanged={onGasOptionSelected}
            /> : <Spinner/>}
          </div>
        }
      </div>
    </>
  );

  return (
    <div ref={ref} className={useClassFor('gas-price')}>
      {gasModes ? renderComponent(gasModes) : <Spinner className="spinner-small" />}
    </div>
  );
};

export const GasPrice = ({isDeployed = true, deployedWallet, sdk, gasLimit, onGasParametersChanged}: GasPriceProps) =>
  sdk.isRefundPaid()
    ? <NoRefundGasPrice sdk={sdk} onGasParametersChanged={onGasParametersChanged} />
    : <GasPriceWithOptions
      isDeployed={isDeployed}
      deployedWallet={deployedWallet}
      gasLimit={gasLimit}
      onGasParametersChanged={onGasParametersChanged}
      sdk={sdk}
    />;

const GasPriceTitle = () => (
  <div className="gas-price-top">
    <p className="gas-price-title">fee</p>
    <div className="gas-price-hint">
      <p className="gas-price-tooltip">Choose transaction speed and token</p>
    </div>
  </div>
);

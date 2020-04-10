import React, {useState} from 'react';
import {CurrencyToValue} from '@unilogin/commons';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import {DeployedWallet} from '@unilogin/sdk';
import {Balance} from '../commons/Balance';
import {Assets} from '../commons/Assets';
import './../styles/funds.sass';
import './../styles/themes/Legacy/fundsThemeLegacy.sass';
import './../styles/themes/UniLogin/fundsThemeUnilogin.sass';
import {NewDeviceMessage} from './Devices/NewDeviceMessage';
import {ThemedComponent} from '../commons/ThemedComponent';

interface FundsProps {
  deployedWallet: DeployedWallet;
  onDeviceMessageClick: () => void;
  onTopUpClick: () => void;
  onSendClick: () => void;
  className?: string;
}

export const Funds = ({deployedWallet, onTopUpClick, onSendClick, className, onDeviceMessageClick}: FundsProps) => {
  const {sdk, contractAddress} = deployedWallet;

  const [totalTokensValue, setTotalTokensValue] = useState<CurrencyToValue>({} as CurrencyToValue);
  useAsyncEffect(() => sdk.subscribeToAggregatedBalance(contractAddress, setTotalTokensValue), []);

  return (
    <ThemedComponent name="funds">
      <div className="funds">
        <NewDeviceMessage
          deployedWallet={deployedWallet}
          onManageClick={onDeviceMessageClick}
          className={className}
        />
        <div className="balance-wrapper">
          <Balance
            amount={totalTokensValue['USD']}
            className={className}
          />
          <div className="funds-buttons">
            <button className="funds-btn funds-topup" onClick={onTopUpClick}>Top-up</button>
            <button id="transferFunds" className="funds-btn funds-send" onClick={onSendClick}>Send</button>
          </div>
        </div>
        <Assets
          deployedWallet={deployedWallet}
          className={className}
        />
      </div>
    </ThemedComponent>
  );
};

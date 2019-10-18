import React, {useState} from 'react';
import {CurrencyToValue} from '@universal-login/commons';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import {DeployedWallet} from '@universal-login/sdk';
import {Balance} from '../commons/Balance';
import {Assets} from '../commons/Assets';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import './../styles/funds.sass';
import './../styles/fundsDefault.sass';

interface FundsProps {
  deployedWallet: DeployedWallet;
  onTopUpClick: () => void;
  onSendClick: () => void;
  className?: string;
}

export const Funds = ({deployedWallet, onTopUpClick, onSendClick, className}: FundsProps) => {
  const {sdk, contractAddress} = deployedWallet;

  const [totalTokensValue, setTotalTokensValue] = useState<CurrencyToValue>({} as CurrencyToValue);
  useAsyncEffect(() => sdk.subscribeToAggregatedBalance(contractAddress, setTotalTokensValue), []);

  return (
    <div className="universal-login-funds">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="funds">
          <Balance
            amount={totalTokensValue['USD']}
            className={className}
          />
          <div className="funds-row">
            <div className="funds-buttons">
              <button className="funds-btn funds-topup" onClick={onTopUpClick}>Top-up</button>
              <button id="transferFunds" className="funds-btn funds-send" onClick={onSendClick}>Send</button>
            </div>
            <Assets
              deployedWallet={deployedWallet}
              className={className}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

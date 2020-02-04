import React, {useState} from 'react';
import {CurrencyToValue} from '@universal-login/commons';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import {DeployedWallet} from '@universal-login/sdk';
import {Balance} from '../commons/Balance';
import {Assets} from '../commons/Assets';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {NewDeviceMessage} from './Devices/NewDeviceMessage';
import {PrimaryButton} from '../commons/buttons/PrimaryButton';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/funds.sass';
import '../styles/themes/UniLogin/fundsThemeUniLogin.sass';

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
    <div className={useClassFor('universal-login-funds')}>
      <div className={getStyleForTopLevelComponent(className)}>
        <div className={classForComponent('funds')}>
          <NewDeviceMessage
            deployedWallet={deployedWallet}
            onManageClick={onDeviceMessageClick}
            className={className}
          />
          <div className={classForComponent('balance-wrapper')}>
            <Balance
              amount={totalTokensValue['USD']}
              className={className}
            />
            <div className={classForComponent('funds-buttons')}>
              <PrimaryButton title="Top-up" className="funds-topup" onClick={onTopUpClick}/>
              <PrimaryButton title="Send" className="funds-send" onClick={onTopUpClick}/>
            </div>
          </div>
          <div className={classForComponent('funds-row')}>

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

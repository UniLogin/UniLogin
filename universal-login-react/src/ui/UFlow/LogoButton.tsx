import React from 'react';
import {ApplicationWallet} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {UDashboard} from './UDashboard';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

export interface LogoButtonProps {
  sdk: UniversalLoginSDK;
  applicationWallet: ApplicationWallet;
  className?: string;
}

export const LogoButton = ({applicationWallet, sdk, className}: LogoButtonProps) => {


  if (applicationWallet.contractAddress.length > 10) {
    return (
      <div className={getStyleForTopLevelComponent(className)}>
        <UDashboard applicationWallet={applicationWallet} sdk={sdk}/>
      </div>
    );
  } else {
    return <></>;
  }
};

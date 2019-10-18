import React from 'react';
import {OnRampProviderName, getOnRampProviderLogo} from './getOnRampProviderLogo';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import {WaitingFor} from '../../commons/WaitingFor';

export interface WaitingForOnRampProviderProps {
  onRampProviderName: OnRampProviderName;
  className?: string;
}

export const WaitingForOnRampProvider = ({className, onRampProviderName}: WaitingForOnRampProviderProps) => {
  const onRampProviderLogo = getOnRampProviderLogo(onRampProviderName, 'white');
  const note = `Waiting for ${onRampProviderName} to send you money`;
  return (
    <div className="universal-login-waiting-for-on-ramp-provider">
      <div className={getStyleForTopLevelComponent(className)}>
        <img src={onRampProviderLogo}/>
        <WaitingFor action={note} className={className}/>
      </div>
    </div>
  );
};

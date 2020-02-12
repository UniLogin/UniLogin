import React from 'react';
import {OnRampProviderName, getOnRampProviderLogo} from './getOnRampProviderLogo';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import {WaitingFor} from '../../commons/WaitingFor';
import '../../styles/base/waitingForOnRampProvider.sass';
import '../../styles/themes/Legacy/waitingForOnRampProviderThemeLegacy.sass';
import {classForComponent, useClassFor} from '../../utils/classFor';

export interface WaitingForOnRampProviderProps {
  onRampProviderName: OnRampProviderName;
  className?: string;
  logoColor?: string;
}

export const WaitingForOnRampProvider = ({className, onRampProviderName, logoColor = 'white'}: WaitingForOnRampProviderProps) => {
  const onRampProviderLogo = getOnRampProviderLogo(onRampProviderName, logoColor);
  const note = `Waiting for ${onRampProviderName} to send you money`;
  return (
    <div className={useClassFor('waiting-for-ramp')}>
      <div className={getStyleForTopLevelComponent(className)}>
        <div className={classForComponent('waiting-for-ramp')}>
          <div className={classForComponent('waiting-for-ramp-content')}>
            <img src={onRampProviderLogo} className={classForComponent('waiting-for-ramp-img')}/>
            <WaitingFor action={note} className={className}/>
          </div>
        </div>
      </div>
    </div>
  );
};

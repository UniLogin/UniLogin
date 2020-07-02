import React from 'react';
import {getOnRampProviderLogo} from './getOnRampProviderLogo';
import {WaitingFor} from '../../commons/WaitingFor';
import {classForComponent, useClassFor, useThemeName} from '../../utils/classFor';
import {TopUpProvider} from '../../../core/models/TopUpProvider';
import '../../styles/base/waitingForOnRampProvider.sass';
import '../../styles/themes/Legacy/waitingForOnRampProviderThemeLegacy.sass';
import '../../styles/themes/UniLogin/waitingForOnRampProviderThemeUniLogin.sass';
import '../../styles/themes/Jarvis/waitingForOnRampProviderThemeJarvis.sass';

export interface WaitingForOnRampProviderProps {
  onRampProviderName: TopUpProvider;
  logoColor?: string;
}

export const WaitingForOnRampProvider = ({onRampProviderName, logoColor}: WaitingForOnRampProviderProps) => {
  const logoColorByTheme = (useThemeName() === 'default') ? 'white' : 'black';
  const onRampProviderLogo = getOnRampProviderLogo(onRampProviderName, logoColor || logoColorByTheme);
  const note = `Waiting for ${onRampProviderName} to send you money`;
  return (
    <div className={useClassFor('waiting-for-ramp')}>
      <div className={classForComponent('waiting-for-ramp')}>
        <div className={classForComponent('waiting-for-ramp-content')}>
          <img src={onRampProviderLogo} className={classForComponent('waiting-for-ramp-img')}/>
          <WaitingFor action={note} />
          <div className={classForComponent('waitingforonramp-pending-img')}></div>
        </div>
      </div>
    </div>
  );
};

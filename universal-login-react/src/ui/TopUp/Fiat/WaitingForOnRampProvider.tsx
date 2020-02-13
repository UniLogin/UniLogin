import React from 'react';
import {OnRampProviderName, getOnRampProviderLogo} from './getOnRampProviderLogo';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import {WaitingFor} from '../../commons/WaitingFor';
import '../../styles/base/waitingForOnRampProvider.sass';
import '../../styles/themes/Legacy/waitingForOnRampProviderThemeLegacy.sass';
import '../../styles/themes/UniLogin/waitingForOnRampProviderThemeUniLogin.sass';
import '../../styles/themes/Jarvis/waitingForOnRampProviderThemeJarvis.sass';
import {classForComponent, useClassFor, useThemeName} from '../../utils/classFor';
import {ModalWrapper} from '../../Modals/ModalWrapper';

export interface WaitingForOnRampProviderProps {
  onRampProviderName: OnRampProviderName;
  className?: string;
  logoColor?: string;
}

export const WaitingForOnRampProvider = ({className, onRampProviderName, logoColor}: WaitingForOnRampProviderProps) => {
  const logoColorByTheme = (useThemeName() === 'default') ? 'white' : 'black';
  const onRampProviderLogo = getOnRampProviderLogo(onRampProviderName, logoColor || logoColorByTheme);
  const note = `Waiting for ${onRampProviderName} to send you money`;
  return (
    <div className={useClassFor('waiting-for-ramp')}>
      <ModalWrapper>
        <div className={getStyleForTopLevelComponent(className)}>
          <div className={classForComponent('waiting-for-ramp')}>
            <div className={classForComponent('waiting-for-ramp-content')}>
              <img src={onRampProviderLogo} className={classForComponent('waiting-for-ramp-img')}/>
              <WaitingFor action={note} className={className}/>
              <div className={classForComponent('waitingforonramp-pending-img')}></div>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
};

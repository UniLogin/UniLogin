import React from 'react';
import {ProgressBar} from '../commons/ProgressBar';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/waitingFor.sass';
import '../styles/themes/Legacy/waitingForThemeLegacy.sass';
import '../styles/themes/Jarvis/waitingForThemeJarvis.sass';
import '../styles/themes/UniLogin/waitingForThemeUniLogin.sass';

export interface WaitingForProps {
  action?: string;
  description?: string;
  className?: string;
}

export const WaitingFor = ({action, description, className}: WaitingForProps) => {
  return (
    <div className={useClassFor('universal-login-waitingfor')}>
      <div className={getStyleForTopLevelComponent(className)}>
        <div className={classForComponent('waitingfor-action-title-box')}>
          {action && <h1 className={classForComponent('waitingfor-action-title')}>{action}</h1>}
          {description && <p className={classForComponent('waitingfor-action-description')}>{description}</p>}
        </div>
        <div className={classForComponent('waitingfor-modal-pending-img')} />
        <div className={classForComponent('waitingfor-modal-pending-section')}>
          <ProgressBar className={classForComponent('waitingfor-pending-bar')}/>
        </div>
      </div>
    </div>
  );
};

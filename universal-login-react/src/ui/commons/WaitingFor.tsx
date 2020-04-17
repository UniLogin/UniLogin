import React from 'react';
import {ProgressBar} from '../commons/ProgressBar';
import {useClassFor, classForComponent} from '../utils/classFor';
import {Spinner} from '../commons/Spinner';
import '../styles/base/waitingFor.sass';
import '../styles/themes/Legacy/waitingForThemeLegacy.sass';
import '../styles/themes/Jarvis/waitingForThemeJarvis.sass';
import '../styles/themes/UniLogin/waitingForThemeUniLogin.sass';

export interface WaitingForProps {
  action?: string;
  description?: string;
}

export const WaitingFor = ({action, description}: WaitingForProps) => {
  return (
    <div className={useClassFor('waitingfor')}>
      <div className={classForComponent('waitingfor-action-title-box')}>
        {action && <h1 className={classForComponent('waitingfor-action-title')}><Spinner />{action}</h1>}
        {description && <p className={classForComponent('waitingfor-action-description')}>{description}</p>}
      </div>
      <div className={classForComponent('waitingfor-modal-pending-img')} />
      <div className={classForComponent('waitingfor-modal-pending-section')}>
        <ProgressBar/>
      </div>
    </div>
  );
};

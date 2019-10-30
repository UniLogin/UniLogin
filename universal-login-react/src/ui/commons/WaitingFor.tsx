import React from 'react';
import {ProgressBar} from '../commons/ProgressBar';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/waitingFor.sass';
import '../styles/waitingForDefault.sass';

export interface WaitingForProps {
  action?: string;
  className?: string;
}

export const WaitingFor = ({action, className}: WaitingForProps) => {
  return (
    <div className="universal-login-waiting-for">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="action-title-box">
          {action && <h1 className="action-title">{action}</h1>}
        </div>
        <div className="modal-pending-img"></div>
        <div className="modal-pending-section">
          <ProgressBar className="pending-bar"/>
        </div>
      </div>
    </div>
  );
};

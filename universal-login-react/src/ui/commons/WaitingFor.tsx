import React from 'react';
import {ProgressBar} from '../commons/ProgressBar';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/base/waitingFor.sass';

export interface WaitingForProps {
  action?: string;
  className?: string;
}

export const WaitingFor = ({action, className}: WaitingForProps) => {
  return (
    <div className="universal-login-waitingfor">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="unilogin-component-waitingfor-action-title-box">
          {action && <h1 className="unilogin-component-waitingfor-action-title">{action}</h1>}
        </div>
        <div className="unilogin-component-waitingfor-modal-pending-img" />
        <div className="unilogin-component-waitingfor-modal-pending-section">
          <ProgressBar className="unilogin-component-waitingfor-pending-bar"/>
        </div>
      </div>
    </div>
  );
};

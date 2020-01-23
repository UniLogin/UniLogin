import React from 'react';
// import {ProgressBar} from '../commons/ProgressBar';
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
          <img className="action-spinner" src="" alt="Spinner icon"/>
        </div>
        <div className="action-text-box">
          <p className="action-text">It takes time to register your username and deploy your wallet. In order to do so, we need to create a transaction and wait until the Ethereum blockchain validates it.</p>
        </div>
        <div className="modal-pending-img" />
      </div>
    </div>
  );
};

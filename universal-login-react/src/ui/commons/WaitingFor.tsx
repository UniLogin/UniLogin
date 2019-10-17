import React, {ReactNode} from 'react';
import {ProgressBar} from '../commons/ProgressBar';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/waitingFor.sass';
import '../styles/waitingForDefault.sass';
import {getOnRampProviderLogo} from '../TopUp/Fiat/getOnRampProviderLogo';

export interface WaitingForProps {
  action?: string;
  children?: ReactNode;
  className?: string;
}

export const WaitingFor = ({action, children, className} : WaitingForProps) => {
  return (
    <div className="universal-login-waiting-for">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="action-title-box">
        {action && <h1 className="action-title">{action}</h1>}
        </div>
        {children}
        <div className="modal-pending-section">
          <ProgressBar className="pending-bar"/>
        </div>
      </div>
    </div>
  );
};

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

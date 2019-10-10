import React, {ReactNode} from 'react';
import {ProgressBar} from '../commons/ProgressBar';
import {ExplorerLink} from '../commons/ExplorerLink';
import '../styles/waitingFor.sass';
import {PublicRelayerConfig} from '@universal-login/commons';
import {Spinner} from './Spinner';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

export interface WaitingForProps {
  action: string;
  relayerConfig: PublicRelayerConfig;
  transactionHash?: string;
  children?: ReactNode;
  className?: string;
}

const renderWaitingFor = (action: string, relayerConfig: PublicRelayerConfig, transactionHash?: string, children?: ReactNode) => {
  return (
    <div>
      <div className="action-title-box">
        <h1 className="action-title">{action}</h1>
      </div>
      <div>
        {children}
        <div className="modal-pending-section">
          <ProgressBar className="pending-bar"/>
          <h3 className="transaction-hash-title">Transaction hash</h3>
          <ExplorerLink chainName={relayerConfig.chainSpec.name} transactionHash={transactionHash} />
        </div>
        <p className="info-text">It takes time to register your username and deploy your wallet. In order to do so, we need to create a transaction and wait until the Ethereum blockchain validates it...</p>
      </div>
    </div>
  );
};

export const WaitingFor = ({action, relayerConfig, transactionHash, children, className}: WaitingForProps) => {
  return (
    <div className="universal-login-waiting-for">
      <div className={getStyleForTopLevelComponent(className)}>
        {relayerConfig ? renderWaitingFor(action, relayerConfig, transactionHash, children) : <Spinner className="waiting-for-spinner" />}
      </div>
    </div>
  );
};

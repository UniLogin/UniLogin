import React from 'react';
import {ExplorerLink} from '../commons/ExplorerLink';
import {Spinner} from './Spinner';
import {PublicRelayerConfig} from '@universal-login/commons';
import {WaitingForProps, WaitingFor} from './WaitingFor';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

export interface WaitingForTransactionProps extends WaitingForProps {
  relayerConfig: PublicRelayerConfig;
  transactionHash?: string;
  info?: string;
}

const renderWaitingForTransaction = ({action, relayerConfig, transactionHash, children, className, info}: WaitingForTransactionProps) => {
  return (
    <div>
      <WaitingFor action={action} className={className}>{children}</WaitingFor>
      <div>
        <div className="modal-pending-section">
          <h3 className="transaction-hash-title">Transaction hash</h3>
          <ExplorerLink chainName={relayerConfig.chainSpec.name} transactionHash={transactionHash} />
        </div>
        <p className="info-text">{info}</p>
      </div>
    </div>
  );
};

export const WaitingForTransaction = ({action, relayerConfig, transactionHash, children, className}: WaitingForTransactionProps) => {
  return (
    <div className="universal-login-waiting-for-transaction">
      <div className={getStyleForTopLevelComponent(className)}>
        {relayerConfig ? renderWaitingForTransaction({action, relayerConfig, transactionHash, children, className}) : <Spinner className="waiting-for-spinner" />}
      </div>
    </div>
  );
};

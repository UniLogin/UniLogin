import React from 'react';
import {ExplorerLink} from '../commons/ExplorerLink';
import {Spinner} from './Spinner';
import {PublicRelayerConfig} from '@universal-login/commons';
import {WaitingForProps, WaitingFor} from './WaitingFor';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

export interface WaitingForTransactionProps extends WaitingForProps {
  relayerConfig: PublicRelayerConfig;
  transactionHash?: string;
}

const renderWaitingForTransaction = ({action, relayerConfig, transactionHash, children}: WaitingForTransactionProps) => {
  return (
    <div>
      <WaitingFor action={action} children={children}/>
      <div>
        <div className="modal-pending-section">
          <h3 className="transaction-hash-title">Transaction hash</h3>
          <ExplorerLink chainName={relayerConfig.chainSpec.name} transactionHash={transactionHash} />
        </div>
        <p className="info-text">It takes time to register your username and deploy your wallet. In order to do so, we need to create a transaction and wait until the Ethereum blockchain validates it...</p>
      </div>
    </div>
  );
};

export const WaitingForTransaction = ({action, relayerConfig, transactionHash, children, className}: WaitingForTransactionProps) => {
  return (
    <div className="universal-login-waiting-for-transaction">
      <div className={getStyleForTopLevelComponent(className)}>
        {relayerConfig ? renderWaitingForTransaction({action, relayerConfig, transactionHash, children}) : <Spinner className="waiting-for-spinner" />}
      </div>
    </div>
  );
};

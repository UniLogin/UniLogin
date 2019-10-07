import React, {ReactNode} from 'react';
import {ProgressBar} from '../commons/ProgressBar';
import {ExplorerLink} from '../commons/ExplorerLink';
import '../styles/waitingFor.sass';

export interface WaitingForProps {
  action: string;
  chainName: string;
  transactionHash?: string;
}

export const WaitingFor = ({action, chainName, transactionHash}: WaitingForProps) => {
  return (
    <div className="universal-login-waiting-for">
      <div className="action-title-box">
        <h1 className="action-title">{action}</h1>
      </div>
      <div>
        <div>
          <ProgressBar className="pending-bar"/>
          <h3 className="transaction-hash-title">Transaction hash</h3>
          <ExplorerLink chainName={chainName} transactionHash={transactionHash} />
        </div>
        <p className="info-text">It takes time to register your username and deploy your wallet. In order to do so, we need to create a transaction and wait until the Ethereum blockchain validates it...</p>
      </div>
    </div>
  );
};

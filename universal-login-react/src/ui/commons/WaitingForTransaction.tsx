import React from 'react';
import {ExplorerLink} from '../commons/ExplorerLink';
import {PublicRelayerConfig} from '@universal-login/commons';
import {WaitingForProps, WaitingFor} from './WaitingFor';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

export interface WaitingForTransactionProps extends WaitingForProps {
  relayerConfig: PublicRelayerConfig;
  transactionHash?: string;
  info?: string;
}

const Body = ({action, relayerConfig, transactionHash, children, className, info}: WaitingForTransactionProps) => {
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

export const WaitingForTransaction = (props: WaitingForTransactionProps) => (
  <div className="universal-login-waiting-for-transaction">
    <div className={getStyleForTopLevelComponent(props.className)}>
      <Body {...props} />
    </div>
  </div>
);

export const WaitingForDeployment = (props: WaitingForTransactionProps) => (
  <WaitingForTransaction
    action={'Wallet creation'}
    {...props}
    info={props.info || DEPLOYMENT_INFO}
  />
);

const DEPLOYMENT_INFO = 'It takes time to register your username and deploy your wallet. In order to do so, we need to create a transaction and wait until the Ethereum blockchain validates it...';

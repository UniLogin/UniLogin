import React from 'react';
import {ProgressBar} from '../commons/ProgressBar';
import AvatarPending1x from '../assets/illustrations/avatatPending@1x.png';
import AvatarPending2x from '../assets/illustrations/avatatPending@2x.png';
import {ExplorerLinkOrMessage} from '../commons/ExplorerLinkOrMessage';
import './../styles/waitingForTransfer.sass';

export interface WaitingForTransferProps {
  action: string;
  chainName: string;
  message?: string;
  transactionHash?: string;
  error?: string;
}

const WaitingForTransfer = (props: WaitingForTransferProps) => {
  return (
    <div className="universal-login-waiting-for-transfer">
      <div className="action-title-box">
        <h1 className="action-title">{props.action}</h1>
      </div>
      <div>
        <h3 className="transaction-status">Transaction status: pending</h3>
        <img
          className="img"
          src={AvatarPending1x}
          srcSet={AvatarPending2x}
          alt="pending"
        />
        <div>
          <ProgressBar className="pending-bar"/>
          <h3 className="transaction-hash-title">Transaction hash</h3>
          <ExplorerLinkOrMessage {...props}/>
        </div>
        <p className="info-text">It takes time to register your username and deploy your wallet. In order to do so, we need to create a transaction and wait until the Ethereum blockchain validates it...</p>
      </div>
    </div>
  );
};

export default WaitingForTransfer;

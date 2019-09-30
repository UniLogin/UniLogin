import React from 'react';
import {ProgressBar} from '@universal-login/react';
import AvatarPending1x from './../../assets/illustrations/avatatPending@1x.png';
import AvatarPending2x from './../../assets/illustrations/avatatPending@2x.png';

interface ModalWaitingForProps {
  action: string;
  transactionHash: string;
  chainName: string;
}

const getEtherscanUrl = (chainName: string, transactionHash: string) => {
  const formattedChainName = chainName.toLowerCase().trim();
  return formattedChainName === 'mainnet'
    ? `https://etherscan.io/tx/${transactionHash}`
    : `https://${formattedChainName}.etherscan.io/tx/${transactionHash}`;
};

const ModalWaitingFor = ({action, chainName, transactionHash}: ModalWaitingForProps) => {
  return (
    <>
      <div className="box-header">
        <h1 className="box-title">{action}</h1>
      </div>
      <div className="box-content modal-pending-content">
        <h3 className="modal-section-title transaction-status-title">Transaction status: pending</h3>
        <img
          className="modal-avatar-pending"
          src={AvatarPending1x}
          srcSet={AvatarPending2x}
          alt="pending"
        />
        <div className="modal-pending-section">
          <ProgressBar className="modal-pending-loader"/>
          <h3 className="modal-section-title transaction-hash-title">Transaction hash</h3>
          <p className="txn-hash-text"><a href={getEtherscanUrl(chainName, transactionHash)} target="_blank">{transactionHash}</a> </p>
        </div>
        <p className="info-text">It takes time to register your username and deploy your wallet. In order to do so, we need to create a transaction and wait until the Ethereum blockchain validates it...</p>
      </div>
    </>
  );
};

export default ModalWaitingFor;

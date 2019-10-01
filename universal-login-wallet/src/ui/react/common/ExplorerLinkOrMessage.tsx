import React from 'react';
import {getEtherscanUrl} from '../../../core/utils/getEtherscanUrl';

interface ExplorerLinkOrMessageProps {
  chainName: string;
  transactionHash?: string;
  message?: string;
  error?: string;
}

export const ExplorerLinkOrMessage = ({chainName, transactionHash, message, error} : ExplorerLinkOrMessageProps) => (
  <p className="txn-hash-text">
    {transactionHash
      ? <a href={getEtherscanUrl(chainName, transactionHash!)} target="_blank">{transactionHash}</a>
      : message || error}
  </p>
);

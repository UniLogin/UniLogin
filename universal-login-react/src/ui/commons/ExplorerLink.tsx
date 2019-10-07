import React from 'react';
import {getEtherscanUrl} from '../../../../universal-login-wallet/src/core/utils/getEtherscanUrl';

interface ExplorerLinkProps {
  chainName: string;
  transactionHash?: string;
}

export const ExplorerLink = ({chainName, transactionHash}: ExplorerLinkProps) => (
  <p className="txn-hash-text">
    {transactionHash
      ? <a href={getEtherscanUrl(chainName, transactionHash!)} target="_blank">{transactionHash}</a>
      : 'The transaction will start in a moment'}
  </p>
);

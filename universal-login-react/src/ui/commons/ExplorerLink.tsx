import React from 'react';
import {getEtherscanUrl} from '../../core/utils/getEtherscanUrl';

interface ExplorerLinkProps {
  chainName: string;
  transactionHash?: string;
}

export const ExplorerLink = ({chainName, transactionHash}: ExplorerLinkProps) => (
  <p className="txn-hash-text">
    {transactionHash
      ? (
        <a
          className="txn-hash-link"
          href={getEtherscanUrl(chainName, transactionHash!)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {transactionHash}
        </a>
      )
      : 'The transaction hash will show in a moment'}
  </p>
);

import React from 'react';
import {getEtherscanUrl} from '../../core/utils/getEtherscanUrl';
import {classForComponent} from '../utils/classFor';
import '../styles/base/waitingForTransaction.sass';
import linkIcon from '../assets/icons/link.svg';

interface ExplorerLinkProps {
  chainName: string;
  transactionHash?: string;
}

export const ExplorerLink = ({chainName, transactionHash}: ExplorerLinkProps) => (
  <p className={classForComponent('waitingfortransaction-txn-hash-text')}>
    {transactionHash
      ? (
        <>
          <a
            className={classForComponent('waitingfortransaction-txn-hash-link')}
            href={getEtherscanUrl(chainName, transactionHash!)}
            target="_blank"
            rel="noopener noreferrer"
          >
            See pending transaction
          </a>
          <img src={linkIcon} className={classForComponent('waitingfortransaction-txn-img')}/>
        </>
      )
      : 'The transaction hash will show in a moment'}
  </p>
);

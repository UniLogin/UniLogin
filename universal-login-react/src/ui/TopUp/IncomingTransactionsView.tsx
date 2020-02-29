import React, {useState} from 'react';
import {FutureWallet} from '@unilogin/sdk';
import {useProperty} from '../..';
import {withPrefix} from 'bem-components-react';
import '../styles/base/incomingTransactionsView.sass';
import receiveIcon from '../assets/icons/receive.svg';
import externalLink from '../assets/icons/externalLink.svg';
import {getEtherscanUrl} from '../../core/utils/getEtherscanUrl';

const bem = withPrefix('u')

export interface IncomingTransactionsViewProps {
  futureWallet: FutureWallet
}

export const IncomingTransactionsView = ({futureWallet}: IncomingTransactionsViewProps) => {
  const [observer] = useState(() => futureWallet.createTopUpObserver());
  const transactions = useProperty(observer.transactions);

  const relayerConfig = futureWallet.sdk.getRelayerConfig();

  return (
    <List>
      {transactions.map(tx => (
        <Row>
          <ReceiveIcon src={receiveIcon}/>
          <IncomingText>Incoming</IncomingText>
          <Value>{tx.value.toDecimals()} ETH</Value>
          <ExternalLinkIcon src={externalLink}/>
          <EthersanLink
            href={getEtherscanUrl(relayerConfig.chainSpec.name, tx.transactionHash)}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on etherscan
          </EthersanLink>
        </Row>
      ))}
    </List>
  );
};

const List = bem.ul('incoming-transactions-view')
const Row = bem.li('incoming-transactions-view__row')
const ReceiveIcon = bem.img('incoming-transactions-view__receive-icon')
const IncomingText = bem.span('incoming-transactions-view__incoming-text')
const Value = bem.span('incoming-transactions-view__value')
const ExternalLinkIcon = bem.img('incoming-transactions-view__external-link-icon')
const EthersanLink = bem.a('incoming-transactions-view__ethersan-link')

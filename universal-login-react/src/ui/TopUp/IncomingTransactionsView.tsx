import React from 'react';
import {ETHER_NATIVE_TOKEN, CurrencyValue} from '@unilogin/commons'
import {WalletService, TopUpTransactionObserver} from '@unilogin/sdk';
import {useEffect, useState} from 'react';
import {useProperty} from '../..';
import {State} from 'reactive-properties';
import {withPrefix} from 'bem-components-react';
import '../styles/base/incomingTransactionsView.sass';
import receiveIcon from '../assets/icons/receive.svg'
import externalLink from '../assets/icons/externalLink.svg'
import {getEtherscanUrl} from '../../core/utils/getEtherscanUrl';
const bem = withPrefix('u')

export interface IncomingTransactionsViewProps {
  walletService: WalletService
}

export const IncomingTransactionsView = ({walletService}: IncomingTransactionsViewProps) => {
  // const state = useProperty(walletService.stateProperty);
  // const [observer, setObserver] = useState<TopUpTransactionObserver | undefined>(undefined);
  // useEffect(() => {
  //   if (state.kind === 'Future') {
  //     setObserver(state.wallet.createTopUpObserver());
  //   }
  // }, [state.kind === 'Future' ? state.wallet : undefined]);
  // const transactions = useProperty(observer?.transactions ?? new State([]));
  const transactions = [{
    value: CurrencyValue.fromDecimals('0.5', ETHER_NATIVE_TOKEN.address),
    transactionHash: '0x60235a2885fe9dfcf4bdae787f6af44c4092872eb4fe23b28e9e46fe856ae3a9'
  }]

  const relayerConfig = walletService.sdk.getRelayerConfig()

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

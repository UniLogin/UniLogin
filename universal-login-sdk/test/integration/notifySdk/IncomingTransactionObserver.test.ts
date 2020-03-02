import {expect} from 'chai';
import {tryExtractIncomingTransaction} from '../../../src/integration/notifySdk/IncomingTransactionObserver';
import {CurrencyValue, ETHER_NATIVE_TOKEN} from '@unilogin/commons';

describe('UNIT: tryExtractTopUpTransaction', () => {
  it('ETH transfer', () => {
    expect(tryExtractIncomingTransaction({
      monitorVersion: '0.46.5',
      status: 'pending',
      monitorId: 'PARITY_42_A_PROD',
      nonce: 115,
      from: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      gas: 21000,
      gasPrice: '9000000000',
      value: '100000000000000',
      to: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      blockHash: null,
      blockNumber: null,
      hash:
        '0x38be051ddcc09a359952bfb5b00819e7841758946d075d61f8bdebed98d6c840',
      input: '0x',
      r:
        '0x407be6a4ef113e1714396e5ea2b3b82c4714b12844b79207dfaef7e654e53190',
      s:
        '0x8e1050bb12631b14c238b5f321f5aaf91b4f3d8cff37a5fea164a95fcd072cb',
      v: '0x78',
      direction: 'outgoing',
      asset: 'ETH',
      counterparty: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      watchedAddress: '0x9ac84278b61d7bb1b6a87ca36c39b22543ee409f',
      eventCode: 'txPool',
      contractCall: undefined,
    } as any, '0x9ac84278b61d7bb1b6a87ca36c39b22543ee409f')).to.deep.eq({
      transactionHash: '0x38be051ddcc09a359952bfb5b00819e7841758946d075d61f8bdebed98d6c840',
      value: CurrencyValue.fromWei('100000000000000', ETHER_NATIVE_TOKEN.address),
    });
  });

  it('filters out ETH transfers with 0 value', () => {
    expect(tryExtractIncomingTransaction({
      monitorVersion: '0.46.5',
      status: 'confirmed',
      timePending: '1970',
      monitorId: 'PARITY_42_A_PROD',
      nonce: 117,
      from: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      blockHash:
        '0xdfb66d26677e2482bdd3adfe6c8da510d2ac4b7afa04ce397d055314538ebddd',
      blockNumber: 17055396,
      gas: 21000,
      gasPrice: '7000000000',
      hash:
        '0x33ce8be7c429cc213af5b2853ab03d8697df72c21bb5c00658d9ffb431ffc488',
      input: '0x',
      r:
        '0x9a00d58f90df7293f821fe5b955426ca9449465a38f960e531aa10c2c8067cd6',
      s:
        '0x59a15e0830ff720efca2be2b5ce330063f8c67fb6507c3f2fe12e87816609e90',
      to: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      transactionIndex: 0,
      v: '0x77',
      value: '0',
      direction: 'outgoing',
      asset: 'ETH',
      counterparty: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      watchedAddress: '0x9ac84278b61d7bb1b6a87ca36c39b22543ee409f',
      eventCode: 'txConfirmed',
      contractCall: undefined,
    } as any, '0x9ac84278b61d7bb1b6a87ca36c39b22543ee409f')).to.eq(undefined);
  });

  it('filters out ETH transfers to different recipient', () => {
    expect(tryExtractIncomingTransaction({
      monitorVersion: '0.46.5',
      status: 'pending',
      monitorId: 'PARITY_42_A_PROD',
      nonce: 115,
      from: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      gas: 21000,
      gasPrice: '9000000000',
      value: '100000000000000',
      to: '0x261CD76C70EEca971Cf3120d94216d436b7446d3',
      blockHash: null,
      blockNumber: null,
      hash:
        '0x38be051ddcc09a359952bfb5b00819e7841758946d075d61f8bdebed98d6c840',
      input: '0x',
      r:
        '0x407be6a4ef113e1714396e5ea2b3b82c4714b12844b79207dfaef7e654e53190',
      s:
        '0x8e1050bb12631b14c238b5f321f5aaf91b4f3d8cff37a5fea164a95fcd072cb',
      v: '0x78',
      direction: 'outgoing',
      asset: 'ETH',
      counterparty: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      watchedAddress: '0x9ac84278b61d7bb1b6a87ca36c39b22543ee409f',
      eventCode: 'txPool',
      contractCall: undefined,
    } as any, '0x9ac84278b61d7bb1b6a87ca36c39b22543ee409f')).to.eq(undefined);
  });

  it('ERC20 token transfer', () => {
    expect(tryExtractIncomingTransaction({
      monitorVersion: '0.46.5',
      status: 'confirmed',
      timePending: '576',
      monitorId: 'PARITY_42_A_PROD',
      nonce: 116,
      from: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      blockHash:
        '0x995687afd4bf5a815baaddf6e5be28535f53313f09d5d4eb6dbe8c93ebaef042',
      blockNumber: 17054713,
      gas: 49209,
      gasPrice: '5000000000',
      hash:
        '0xad19fee9dab11d47c8500d7330786f747884972130f24ecad96d92b4ae6341bf',
      input:
        '0xa9059cbb0000000000000000000000009ac84278b61d7bb1b6a87ca36c39b22543ee409f0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      r:
        '0x1d0092928e2c0ea0b44351dbe29766c880d31634dc4628b63166afeeddfa6861',
      s:
        '0x15f6792302b0b076fbec8c31fecf36ac317ec0741a8bbaf61e0b341cc4bbc0f8',
      to: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
      transactionIndex: 0,
      v: '0x77',
      value: '0',
      direction: 'incoming',
      asset: 'DAI',
      counterparty: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      watchedAddress: '0x9ac84278b61d7bb1b6a87ca36c39b22543ee409f',
      eventCode: 'txConfirmed',
      contractCall: {
        contractType: 'erc20',
        contractAddress: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
        methodName: 'transfer',
        params: {
          _to: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
          _value: '1000000000000000000',
        },
      },
    } as any, '0x9ac84278b61d7bb1b6a87ca36c39b22543ee409f')).to.deep.eq({
      transactionHash: '0xad19fee9dab11d47c8500d7330786f747884972130f24ecad96d92b4ae6341bf',
      value: CurrencyValue.fromWei('1000000000000000000', '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'),
    });
  });

  it('filters out ERC20 token transfers with 0 value', () => {
    expect(tryExtractIncomingTransaction({
      monitorVersion: '0.46.5',
      status: 'confirmed',
      timePending: '576',
      monitorId: 'PARITY_42_A_PROD',
      nonce: 116,
      from: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      blockHash:
        '0x995687afd4bf5a815baaddf6e5be28535f53313f09d5d4eb6dbe8c93ebaef042',
      blockNumber: 17054713,
      gas: 49209,
      gasPrice: '5000000000',
      hash:
        '0xad19fee9dab11d47c8500d7330786f747884972130f24ecad96d92b4ae6341bf',
      input:
        '0xa9059cbb0000000000000000000000009ac84278b61d7bb1b6a87ca36c39b22543ee409f0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      r:
        '0x1d0092928e2c0ea0b44351dbe29766c880d31634dc4628b63166afeeddfa6861',
      s:
        '0x15f6792302b0b076fbec8c31fecf36ac317ec0741a8bbaf61e0b341cc4bbc0f8',
      to: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
      transactionIndex: 0,
      v: '0x77',
      value: '0',
      direction: 'incoming',
      asset: 'DAI',
      counterparty: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      watchedAddress: '0x9ac84278b61d7bb1b6a87ca36c39b22543ee409f',
      eventCode: 'txConfirmed',
      contractCall: {
        contractType: 'erc20',
        contractAddress: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
        methodName: 'transfer',
        params: {
          _to: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
          _value: '0',
        },
      },
    } as any, '0x9ac84278b61d7bb1b6a87ca36c39b22543ee409f')).to.eq(undefined);
  });

  it('filters out ERC20 token transfer to different recipient', () => {
    expect(tryExtractIncomingTransaction({
      monitorVersion: '0.46.5',
      status: 'confirmed',
      timePending: '576',
      monitorId: 'PARITY_42_A_PROD',
      nonce: 116,
      from: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      blockHash:
        '0x995687afd4bf5a815baaddf6e5be28535f53313f09d5d4eb6dbe8c93ebaef042',
      blockNumber: 17054713,
      gas: 49209,
      gasPrice: '5000000000',
      hash:
        '0xad19fee9dab11d47c8500d7330786f747884972130f24ecad96d92b4ae6341bf',
      input:
        '0xa9059cbb0000000000000000000000009ac84278b61d7bb1b6a87ca36c39b22543ee409f0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      r:
        '0x1d0092928e2c0ea0b44351dbe29766c880d31634dc4628b63166afeeddfa6861',
      s:
        '0x15f6792302b0b076fbec8c31fecf36ac317ec0741a8bbaf61e0b341cc4bbc0f8',
      to: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
      transactionIndex: 0,
      v: '0x77',
      value: '0',
      direction: 'incoming',
      asset: 'DAI',
      counterparty: '0x9ac84278B61D7Bb1B6a87CA36C39b22543eE409F',
      watchedAddress: '0x9ac84278b61d7bb1b6a87ca36c39b22543ee409f',
      eventCode: 'txConfirmed',
      contractCall: {
        contractType: 'erc20',
        contractAddress: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
        methodName: 'transfer',
        params: {
          _to: '0x261CD76C70EEca971Cf3120d94216d436b7446d3',
          _value: '100000',
        },
      },
    } as any, '0x9ac84278b61d7bb1b6a87ca36c39b22543ee409f')).to.eq(undefined);
  });
});

import {TEST_CONTRACT_ADDRESS} from '@unilogin/commons';

export const TEST_STORAGE_KEY = 'wallet-ganache';

export const keyAddedEvent = {
  blockNumber: 24,
  address: TEST_CONTRACT_ADDRESS,
  blockHash: '0x0019385a7f32d8b440e00f6c55f875051aa1434df982037b11dc18034377cda0',
  transactionIndex: 0,
  data: '0x',
  topics:
    ['0x654abba5d3170185ed25c9b41f7d2094db3643986b05e9e9cab37028b800ad7e',
      '0x0000000000000000000000005000000000000000000000000000000000000005'],
  transactionHash:
    '0x34f7dde97ebc76d7ffb9e0df5b301834fd77504b4e204a17acc9e69cead76309',
  logIndex: 0,
};

export const keyRemovedEvent = {
  blockNumber: 25,
  blockHash:
    '0x7140a56037572cff2b5d31ae71d09828f88f0a4c6bc9fe361072e66946ce9f94',
  transactionIndex: 0,
  address: TEST_CONTRACT_ADDRESS,
  data: '0x',
  topics:
    ['0xd2b2d9609b634ccc6f93482de9f8431ec6222fed4fa3cfca3b2a7e1a96a924ae',
      '0x0000000000000000000000005000000000000000000000000000000000000005'],
  transactionHash:
    '0x9532c523e37e26d38beeecf5552c48249b89b5a7dcb529b9586e5182ff86dc3a',
  logIndex: 0,
};

export const addedOwnerEvent = {
  blockNumber: 31,
  blockHash:
   '0x9d12bfd3952b9d4484a580161c31e534426e3398adfea6bf06b8dda3259bf716',
  transactionIndex: 0,
  address: '0xe5Eff8AE63974a38b5D0bF64EC40e3C88C81B158',
  data:
   '0x0000000000000000000000005000000000000000000000000000000000000005',
  topics:
   ['0x9465fa0c962cc76958e6373a993326400c1c94f8be2fe3a952adfa7f60b2ea26'],
  transactionHash:
   '0xe4065ec127e30c3cc82821601dcf62c3e5b444667f7e6274687daa6c7db8c6c3',
  logIndex: 0,
};

import {defaultAccounts} from 'ethereum-waffle';

module.exports = Object.freeze({
  jsonRpcUrl: 'http://localhost:18545',
  port: 3311,
  privateKey: defaultAccounts[0].secretKey,
  chainSpec: {
    ensAddress: process.env.ENS_ADDRESS,
    chainId: 0
  },
  ensRegistrars: {
    'mylogin.eth': process.env.ENS_REGISTRAR1,
    'universal-id.eth': process.env.ENS_REGISTRAR2,
    'popularapp.eth': process.env.ENS_REGISTRAR3
  }
});

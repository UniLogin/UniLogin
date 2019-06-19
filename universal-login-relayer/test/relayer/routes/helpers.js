import {Wallet} from 'ethers';
import {RelayerUnderTest} from '../../../lib/utils/relayerUnderTest';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {waitForContractDeploy} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import chai from 'chai';

export const startRelayer = async (port = '33111') => {
  const provider = createMockProvider();
  const [deployer] = getWallets(provider);
  const wallet = Wallet.createRandom();
  const otherWallet = Wallet.createRandom();
  const {relayer, factoryContract, walletMaster, mockToken} = await RelayerUnderTest.createPreconfigured(deployer, port);
  await relayer.start();
  return {provider, wallet, otherWallet, relayer, deployer, factoryContract, walletMaster, mockToken};
};

export const createWalletContract = async (provider, relayerUrlOrServer, publicKey, ensName = 'marek.mylogin.eth') => {
  const result = await chai.request(relayerUrlOrServer)
  .post('/wallet')
  .send({
    managementKey: publicKey,
    ensName
  });
  const {transaction} = result.body;
  return waitForContractDeploy(provider, WalletContract, transaction.hash);
};

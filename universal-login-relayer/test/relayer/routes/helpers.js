import {Wallet} from 'ethers';
import {RelayerUnderTest} from '../../../lib/utils/relayerUnderTest';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {waitForContractDeploy} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import chai from 'chai';

export const startRelayer = async () => {
  const provider = createMockProvider();
  const [deployer] = getWallets(provider);
  const wallet = Wallet.createRandom();
  const otherWallet = Wallet.createRandom();
  const relayer = await RelayerUnderTest.createPreconfigured(deployer);
  await relayer.start();
  return {provider, wallet, otherWallet, relayer, deployer};
};

export const createWalletContract = async (provider, relayer, wallet) => {
  const result = await chai.request(relayer.server)
  .post('/wallet')
  .send({
    managementKey: wallet.address,
    ensName: 'marek.mylogin.eth',
  });
  const {transaction} = result.body;
  return waitForContractDeploy(provider, WalletContract, transaction.hash);
};

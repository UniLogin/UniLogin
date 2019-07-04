import {Wallet, utils, Contract} from 'ethers';
import {RelayerUnderTest} from '../../lib/http/relayers/RelayerUnderTest';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import {waitForContractDeploy} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import WalletMasterWithRefund from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import chai from 'chai';
import {deployFactory, getFutureAddress} from '@universal-login/contracts';

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

export const createWalletCounterfactually = async (wallet, relayerUrlOrServer, publicKey, walletMasterAddress, factoryContractAddress, ensName = 'marek.mylogin.eth') => {
  const futureAddress = getFutureAddress(walletMasterAddress, factoryContractAddress, publicKey);
  await wallet.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
  await chai.request(relayerUrlOrServer)
  .post('/wallet/deploy')
  .send({
    publicKey,
    ensName,
    gasPrice: '1'
  });
  return new Contract(futureAddress, WalletContract.interface, wallet);
};


export const startRelayerWithRefund = async (port = '33111') => {
  const provider = createMockProvider();
  const [deployer] = getWallets(provider);
  const walletMaster = await deployContract(deployer, WalletMasterWithRefund);
  const factoryContract = await deployFactory(deployer, walletMaster.address);
  const {relayer, mockToken} = await RelayerUnderTest.createPreconfiguredRelayer({port, wallet: deployer, walletMaster, factoryContract});
  await relayer.start();
  return {provider, relayer, mockToken, factoryContract, walletMaster, deployer};
};

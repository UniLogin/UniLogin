import chai from 'chai';
import {Contract, utils, Wallet} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {
  calculateInitializeSignature,
  ETHER_NATIVE_TOKEN,
  parseDomain,
  TEST_APPLICATION_INFO,
  TEST_GAS_PRICE,
  waitForContractDeploy,
} from '@universal-login/commons';
import {beta2, deployFactory, deployWalletContract, encodeInitializeWithENSData, ENSInterface} from '@universal-login/contracts';
import {getFutureAddress} from '@universal-login/contracts/testutils';
import {RelayerUnderTest} from '../../src/http/relayers/RelayerUnderTest';
import {waitForDeploymentStatus} from './waitForDeploymentStatus';

export const startRelayer = async (port = '33111') => {
  const provider = createMockProvider();
  const [deployer] = getWallets(provider);
  const wallet = Wallet.createRandom();
  const otherWallet = Wallet.createRandom();
  const {relayer, factoryContract, walletContract, mockToken, ensAddress} = await RelayerUnderTest.createPreconfigured(deployer, port);
  await relayer.start();
  return {provider, wallet, otherWallet, relayer, deployer, factoryContract, walletContract, mockToken, ensAddress};
};

export const createWalletContract = async (provider, relayerUrlOrServer, publicKey, ensName = 'marek.mylogin.eth') => {
  const result = await chai.request(relayerUrlOrServer)
    .post('/wallet')
    .send({
      managementKey: publicKey,
      ensName,
    });
  const {transaction} = result.body;
  return waitForContractDeploy(provider, beta2.WalletContract, transaction.hash);
};

export const createWalletCounterfactually = async (wallet, relayerUrlOrServer, keyPair, walletContractAddress, factoryContractAddress, ensAddress, ensName = 'marek.mylogin.eth') => {
  const futureAddress = getFutureAddress(walletContractAddress, factoryContractAddress, keyPair.publicKey);
  await wallet.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
  const initData = await getInitData(keyPair, ensName, ensAddress, wallet.provider, TEST_GAS_PRICE);
  const signature = await calculateInitializeSignature(initData, keyPair.privateKey);
  const result = await chai.request(relayerUrlOrServer)
    .post('/wallet/deploy')
    .send({
      publicKey: keyPair.publicKey,
      ensName,
      gasPrice: TEST_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      signature,
      applicationInfo: TEST_APPLICATION_INFO,
    });
  await waitForDeploymentStatus(relayerUrlOrServer, result.body.deploymentHash, 'Success');
  const WalletContractInterface = new utils.Interface(beta2.WalletContract.interface);
  return new Contract(futureAddress, WalletContractInterface, wallet);
};

export const startRelayerWithRefund = async (port = '33111') => {
  const provider = createMockProvider();
  const [deployer, wallet, otherWallet] = getWallets(provider);
  const walletContract = await deployWalletContract(deployer);
  const factoryContract = await deployFactory(deployer, walletContract.address);
  const {relayer, mockToken, ensAddress} = await RelayerUnderTest.createPreconfiguredRelayer({port, wallet: deployer, walletContract, factoryContract});
  await relayer.start();
  return {provider, relayer, mockToken, factoryContract, walletContract, deployer, ensAddress, wallet, otherWallet};
};

export const getInitData = async (keyPair, ensName, ensAddress, provider, gasPrice, gasToken = ETHER_NATIVE_TOKEN.address) => {
  const [label, domain] = parseDomain(ensName);
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
  const node = utils.namehash(`${label}.${domain}`);
  const ens = new Contract(ensAddress, ENSInterface, provider);
  const resolverAddress = await ens.resolver(utils.namehash(domain));
  const registrarAddress = await ens.owner(utils.namehash(domain));
  return encodeInitializeWithENSData([keyPair.publicKey, hashLabel, ensName, node, ensAddress, registrarAddress, resolverAddress, gasPrice, gasToken]);
};

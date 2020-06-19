import chai from 'chai';
import {Contract, utils, Wallet} from 'ethers';
import {Provider} from 'ethers/providers';
import {MockProvider} from 'ethereum-waffle';
import {
  calculateInitializeSignature,
  ETHER_NATIVE_TOKEN,
  parseDomain,
  TEST_APPLICATION_INFO,
  TEST_GAS_PRICE,
  DEPLOY_GAS_LIMIT,
  KeyPair,
} from '@unilogin/commons';
import {beta2, encodeInitializeWithENSData, ENSInterface, encodeDataForSetup, gnosisSafe, INITIAL_REQUIRED_CONFIRMATIONS} from '@unilogin/contracts';
import {getFutureAddress} from '@unilogin/contracts/testutils';
import {RelayerUnderTest} from '../../src/http/relayers/RelayerUnderTest';
import {waitForDeploymentStatus} from './waitForDeploymentStatus';

export const createWalletCounterfactually = async (wallet: Wallet, relayerUrlOrServer: string, keyPair: KeyPair, walletContractAddress: string, factoryContractAddress: string, ensAddress: string, ensName = 'marek.mylogin.eth') => {
  const futureAddress = getFutureAddress(walletContractAddress, factoryContractAddress, keyPair.publicKey);
  await wallet.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
  const initData = await getInitData(keyPair, ensName, ensAddress, wallet.provider, TEST_GAS_PRICE);
  const signature = calculateInitializeSignature(initData, keyPair.privateKey);
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

export const startRelayer = async (port = '33111') => {
  const provider = new MockProvider();
  const [deployer, wallet, otherWallet] = provider.getWallets();
  const {relayer, factoryContract, ensAddress, walletContract, mockToken, ensRegistrar, fallbackHandlerContract} = await RelayerUnderTest.createPreconfigured(deployer, port);
  await relayer.start();
  return {provider, relayer, mockToken, factoryContract, walletContract, deployer, ensAddress, wallet, otherWallet, ensRegistrar, fallbackHandlerContract};
};

export const getInitData = async (keyPair: KeyPair, ensName: string, ensAddress: string, provider: Provider, gasPrice: string, gasToken = ETHER_NATIVE_TOKEN.address) => {
  const [label, domain] = parseDomain(ensName);
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
  const node = utils.namehash(`${label}.${domain}`);
  const ens = new Contract(ensAddress, ENSInterface, provider);
  const resolverAddress = await ens.resolver(utils.namehash(domain));
  const registrarAddress = await ens.owner(utils.namehash(domain));
  return encodeInitializeWithENSData([keyPair.publicKey, hashLabel, ensName, node, ensAddress, registrarAddress, resolverAddress, gasPrice, gasToken]);
};

export const getSetupData = async (keyPair: KeyPair, ensName: string, ensAddress: string, provider: Provider, gasPrice: string, relayerAddress: string, ensRegistrarAddress: string, fallbackHandlerAddress: string, gasToken = ETHER_NATIVE_TOKEN.address) => {
  const [label, domain] = parseDomain(ensName);
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
  const node = utils.namehash(`${label}.${domain}`);
  const ens = new Contract(ensAddress, ENSInterface, provider);
  const resolverAddress = await ens.resolver(utils.namehash(domain));
  const registrarAddress = await ens.owner(utils.namehash(domain));
  const deployment = {
    owners: [keyPair.publicKey],
    requiredConfirmations: INITIAL_REQUIRED_CONFIRMATIONS,
    deploymentCallAddress: ensRegistrarAddress,
    deploymentCallData: new utils.Interface(gnosisSafe.ENSRegistrar.interface).functions.register.encode([hashLabel, ensName, node, ensAddress, registrarAddress, resolverAddress]),
    fallbackHandler: fallbackHandlerAddress,
    paymentToken: gasToken,
    payment: utils.bigNumberify(gasPrice).mul(DEPLOY_GAS_LIMIT).toString(),
    refundReceiver: relayerAddress,
  };
  return encodeDataForSetup(deployment);
};

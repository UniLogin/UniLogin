import {ETHER_NATIVE_TOKEN, createKeyPair} from '@universal-login/commons';
import {DEPLOY_CONTRACT_NONCE, deployGnosisSafe, deployProxyFactory, encodeDataForSetup, computeGnosisCounterfactualAddress, GnosisSafeInterface, ProxyFactoryInterface, ENSInterface} from '@universal-login/contracts';
import {Contract, utils, Wallet} from 'ethers';
import {AddressZero} from 'ethers/constants';
import ENSRegistrar from '@universal-login/contracts/dist/contracts/ENSRegistrar.json';
import {DEPLOY_GAS_LIMIT, parseDomain} from '@universal-login/commons';

export default async function createGnosisSafeContract(wallet: Wallet) {
  const gnosisSafe = await deployGnosisSafe(wallet);
  const proxyFactory = await deployProxyFactory(wallet);
  const {proxyContract, keyPair} = await deployGnosisSafeProxy(wallet, proxyFactory.address, gnosisSafe.address);
  return {
    proxy: proxyContract,
    proxyFactory,
    master: gnosisSafe,
    keyPair,
  };
}

export const deployGnosisSafeProxy = async (wallet: Wallet, proxyFactoryAddress: string, gnosisSafeAddress: string) => {
  const keyPair = createKeyPair();
  const deployment = {
    owners: [keyPair.publicKey],
    requiredConfirmations: 1,
    deploymentCallAddress: AddressZero,
    deploymentCallData: '0x0',
    fallbackHandler: AddressZero,
    paymentToken: ETHER_NATIVE_TOKEN.address,
    payment: '0',
    refundReceiver: wallet.address,
  };
  const setupData = encodeDataForSetup(deployment);
  const computedAddress = computeGnosisCounterfactualAddress(proxyFactoryAddress, DEPLOY_CONTRACT_NONCE, setupData, gnosisSafeAddress);
  await new Contract(proxyFactoryAddress, ProxyFactoryInterface, wallet).createProxyWithNonce(gnosisSafeAddress, setupData, DEPLOY_CONTRACT_NONCE);
  await wallet.sendTransaction({to: computedAddress, value: utils.parseEther('1.0')});
  return {proxyContract: new Contract(computedAddress, GnosisSafeInterface, wallet.provider), keyPair};
};

export const deployGnosisSafeProxyWithENS = async (wallet: Wallet, proxyFactoryAddress: string, gnosisSafeAddress: string, ensName: string, ensAddress: string, ensRegistrar: string, gasPrice = '0', gasToken = ETHER_NATIVE_TOKEN.address) => {
  const [label, domain] = parseDomain(ensName);
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
  const name = `${label}.${domain}`;
  const node = utils.namehash(name);
  const ens = new Contract(ensAddress, ENSInterface, wallet);
  const publicResolver = await ens.resolver(utils.namehash(domain));
  const registrarAddress = await ens.owner(utils.namehash(domain));
  const args = [hashLabel, name, node, ensAddress, registrarAddress, publicResolver];
  const keyPair = createKeyPair();
  const deployment = {
    owners: [keyPair.publicKey],
    requiredConfirmations: 1,
    deploymentCallAddress: ensRegistrar,
    deploymentCallData: new utils.Interface(ENSRegistrar.interface as any).functions.register.encode(args),
    fallbackHandler: AddressZero,
    paymentToken: gasToken,
    payment: utils.bigNumberify(gasPrice).mul(DEPLOY_GAS_LIMIT).toString(),
    refundReceiver: wallet.address,
  };
  const setupData = encodeDataForSetup(deployment);
  const computedAddress = computeGnosisCounterfactualAddress(proxyFactoryAddress, DEPLOY_CONTRACT_NONCE, setupData, gnosisSafeAddress);
  await wallet.sendTransaction({to: computedAddress, value: utils.parseEther('10.0')});
  await new Contract(proxyFactoryAddress, ProxyFactoryInterface, wallet).createProxyWithNonce(gnosisSafeAddress, setupData, DEPLOY_CONTRACT_NONCE);
  return {proxyContract: new Contract(computedAddress, GnosisSafeInterface, wallet.provider), keyPair};
};

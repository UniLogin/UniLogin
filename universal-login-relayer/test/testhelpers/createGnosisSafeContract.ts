import {ETHER_NATIVE_TOKEN, createKeyPair} from '@universal-login/commons';
import {deployGnosisSafe, deployProxyFactory, encodeDataForSetup, computeGnosisCounterfactualAddress, GnosisSafeInterface, ProxyFactoryInterface} from '@universal-login/contracts';
import {Contract, utils, Wallet} from 'ethers';
import {AddressZero} from 'ethers/constants';

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
  const computedAddress = computeGnosisCounterfactualAddress(proxyFactoryAddress, 0, setupData, gnosisSafeAddress);
  await new Contract(proxyFactoryAddress, ProxyFactoryInterface, wallet).createProxyWithNonce(gnosisSafeAddress, setupData, 0);
  await wallet.sendTransaction({to: computedAddress, value: utils.parseEther('1.0')});
  return {proxyContract: new Contract(computedAddress, GnosisSafeInterface, wallet.provider), keyPair};
};

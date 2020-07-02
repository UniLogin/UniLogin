import {ETHER_NATIVE_TOKEN, createKeyPair, TEST_GAS_PRICE, OperationType, CURRENT_NETWORK_VERSION} from '@unilogin/commons';
import {Contract, utils, Wallet} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {GnosisSafeInterface} from '../../src/gnosis-safe@1.1.1/interfaces';
import {encodeDataForSetup, encodeDataForExecTransaction} from '../../src/gnosis-safe@1.1.1/encode';
import {deployGnosisSafe, deployProxyFactory, deployDefaultCallbackHandler} from '../../src/gnosis-safe@1.1.1/deployContracts';
import {computeGnosisCounterfactualAddress, getPreviousOwner} from '../../src/gnosis-safe@1.1.1/utils';
import {messageToSignedMessage, INITIAL_REQUIRED_CONFIRMATIONS} from '../../src';
import {MockProvider} from 'ethereum-waffle';

export async function setupGnosisSafeContract(wallet: Wallet) {
  const gnosisSafe = await deployGnosisSafe(wallet);
  const proxyFactory = await deployProxyFactory(wallet);
  const callbackHandler = await deployDefaultCallbackHandler(wallet);
  const keyPair = createKeyPair();
  const deployment = {
    owners: [keyPair.publicKey],
    requiredConfirmations: INITIAL_REQUIRED_CONFIRMATIONS,
    deploymentCallAddress: AddressZero,
    deploymentCallData: '0x0',
    fallbackHandler: callbackHandler.address,
    paymentToken: ETHER_NATIVE_TOKEN.address,
    payment: '0',
    refundReceiver: wallet.address,
  };
  const setupData = encodeDataForSetup(deployment);
  const computedAddress = computeGnosisCounterfactualAddress(proxyFactory.address, 0, setupData, gnosisSafe.address);
  await proxyFactory.createProxyWithNonce(gnosisSafe.address, setupData, 0);
  await wallet.sendTransaction({to: computedAddress, value: utils.parseEther('1.0')});
  const proxyContract = new Contract(computedAddress, GnosisSafeInterface, wallet.provider);
  return {
    proxy: proxyContract,
    proxyFactory,
    master: gnosisSafe,
    keyPair,
  };
}

export async function executeAddKey(wallet: Wallet, proxyAddress: string, keyToAdd: string, privateKey: string) {
  const proxyContract = new Contract(proxyAddress, GnosisSafeInterface, wallet.provider);
  const requiredSign = await proxyContract.getThreshold();
  const msg = {
    to: proxyAddress,
    from: proxyAddress,
    data: GnosisSafeInterface.functions.addOwnerWithThreshold.encode([keyToAdd, requiredSign]),
    nonce: await proxyContract.nonce(),
    gasToken: ETHER_NATIVE_TOKEN.address,
    gasPrice: TEST_GAS_PRICE,
    gasLimit: '300000',
    operationType: OperationType.call,
    refundReceiver: wallet.address,
  };
  const signedMsg = messageToSignedMessage(msg, privateKey, CURRENT_NETWORK_VERSION, 'beta3');
  return wallet.sendTransaction({to: proxyAddress, data: encodeDataForExecTransaction(signedMsg), gasLimit: utils.bigNumberify(msg.gasLimit)});
}

export async function executeRemoveKey(wallet: Wallet, proxyAddress: string, keyToRemove: string, privateKey: string) {
  const proxyContract = new Contract(proxyAddress, GnosisSafeInterface, wallet.provider);
  const requiredSign = await proxyContract.getThreshold();
  const owners: string[] = await proxyContract.getOwners();
  const previousOwner = getPreviousOwner(owners, keyToRemove);
  const msg = {
    to: proxyAddress,
    from: proxyAddress,
    data: GnosisSafeInterface.functions.removeOwner.encode([previousOwner, keyToRemove, requiredSign]),
    nonce: await proxyContract.nonce(),
    gasToken: ETHER_NATIVE_TOKEN.address,
    gasPrice: TEST_GAS_PRICE,
    gasLimit: '300000',
    operationType: OperationType.call,
    refundReceiver: wallet.address,
  };
  const signedMessage = messageToSignedMessage(msg, privateKey, CURRENT_NETWORK_VERSION, 'beta3');
  return wallet.sendTransaction({to: proxyAddress, data: encodeDataForExecTransaction(signedMessage), gasLimit: utils.bigNumberify(msg.gasLimit)});
}

export async function setupGnosisSafeContractFixture(provider: MockProvider, [wallet]: Wallet[]) {
  return {...await setupGnosisSafeContract(wallet), provider};
}

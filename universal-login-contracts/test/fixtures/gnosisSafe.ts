import {ETHER_NATIVE_TOKEN, createKeyPair, TEST_GAS_PRICE, OperationType, CURRENT_NETWORK_VERSION, concatenateSignatures, sortPrivateKeysByAddress} from '@universal-login/commons';
import {Contract, utils, Wallet} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {GnosisSafeInterface} from '../../src/gnosis-safe@1.1.1/interfaces';
import {encodeDataForSetup, encodeDataForExecTransaction} from '../../src/gnosis-safe@1.1.1/encode';
import {deployGnosisSafe, deployProxyFactory} from '../../src/gnosis-safe@1.1.1/deployContracts';
import {computeGnosisCounterfactualAddress, getPreviousOwner, calculateMessageSignature} from '../../src/gnosis-safe@1.1.1/utils';
import {Provider} from 'ethers/providers';
import {messageToSignedMessage} from '../../src';

export async function setupGnosisSafeContract(wallet: Wallet) {
  const gnosisSafe = await deployGnosisSafe(wallet);
  const proxyFactory = await deployProxyFactory(wallet);
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
  const computedAddress = computeGnosisCounterfactualAddress(proxyFactory.address, 0, setupData, gnosisSafe.address);
  await proxyFactory.createProxyWithNonce(gnosisSafe.address, setupData, 0);
  await wallet.sendTransaction({to: computedAddress, value: utils.parseEther('1.0')});
  const proxyContract = new Contract(computedAddress, GnosisSafeInterface, wallet.provider);
  return {
    proxy: proxyContract,
    proxyFactory,
    master: gnosisSafe,
    provider: wallet.provider,
    keyPair,
  };
}

export async function executeAddKey(wallet: Wallet, proxyAddress: string, keyToAdd: string, privateKey: string) {
  const proxyContract = new Contract(proxyAddress, GnosisSafeInterface, wallet.provider);
  const requiredSign = (await proxyContract.getThreshold()).add(1);
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
  await wallet.sendTransaction({to: proxyAddress, data: encodeDataForExecTransaction(signedMsg), gasLimit: utils.bigNumberify(msg.gasLimit)});
}

export async function executeRemoveKey(wallet: Wallet, proxyAddress: string, keyToRemove: string, privateKeys: string[]) {
  const proxyContract = new Contract(proxyAddress, GnosisSafeInterface, wallet.provider);
  const requiredSign = (await proxyContract.getThreshold()).sub(1);
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
  const sortedPrivateKeys = sortPrivateKeysByAddress(privateKeys);
  const {signature, ...unsignedMessage} = messageToSignedMessage(msg, sortedPrivateKeys[0], CURRENT_NETWORK_VERSION, 'beta3');
  const signature2 = calculateMessageSignature(unsignedMessage, sortedPrivateKeys[1]);
  const signatures = concatenateSignatures([signature, signature2]);
  const finalMsg = {...unsignedMessage, signature: signatures};
  await wallet.sendTransaction({to: proxyAddress, data: encodeDataForExecTransaction(finalMsg), gasLimit: utils.bigNumberify(msg.gasLimit)});
}

export async function setupGnosisSafeContractFixture(provider: Provider, [wallet]: Wallet[]) {
  return setupGnosisSafeContract(wallet);
}

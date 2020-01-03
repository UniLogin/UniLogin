import {ETHER_NATIVE_TOKEN, createKeyPair} from '@universal-login/commons';
import {Contract, utils, Wallet} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {GnosisSafeInterface} from '../../src/gnosis-safe@1.1.1/interfaces';
import {encodeDataForSetup} from '../../src/gnosis-safe@1.1.1/encode';
import {deployGnosisSafe, deployProxyFactory} from '../../src/gnosis-safe@1.1.1/deployContracts';
import {computeGnosisCounterfactualAddress} from '../../src/gnosis-safe@1.1.1/utils';
import {Provider} from 'ethers/providers';

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

export async function setupGnosisSafeContractFixture(provider: Provider, [wallet]: Wallet[]) {
  return setupGnosisSafeContract(wallet);
}

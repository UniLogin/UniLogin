import {expect} from 'chai';
import {providers, Wallet, Contract, utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {loadFixture, deployContract} from 'ethereum-waffle';
import {createKeyPair, ETHER_NATIVE_TOKEN, removeHexStringPrefix, TEST_ACCOUNT_ADDRESS, OperationType} from '@unilogin/commons';
import {basicENS} from '@unilogin/commons/testutils';
import {deployGnosisSafe, deployProxyFactory} from '../../../src/gnosis-safe@1.1.1/deployContracts';
import {IProxyInterface} from '../../../src/gnosis-safe@1.1.1/interfaces';
import {encodeDataForSetup, encodeDataForExecTransaction} from '../../../src/gnosis-safe@1.1.1/encode';
import {computeGnosisCounterfactualAddress} from '../../../src/gnosis-safe@1.1.1/utils';
import ENSRegistrar from '../../../dist/contracts/ENSRegistrar.json';
import {TransactionResponse} from 'ethers/providers';
import {messageToSignedMessage} from '../../../src';
import {INITIAL_REQUIRED_CONFIRMATIONS} from '../../../src/gnosis-safe@1.1.1/constants';

describe('GnosisSafe', async () => {
  const domain = 'mylogin.eth';
  const label = 'alex';
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
  const name = `${label}.${domain}`;
  const node = utils.namehash(name);
  let providerWithENS: providers.Provider;
  let wallet: Wallet;
  let gnosisSafe: Contract;
  let proxyFactory: Contract;
  let ensAddress: string;
  let registrarAddress: string;
  let publicResolver: string;
  let ensRegistrar: Contract;
  let computedAddress: string;
  let deploymentTransaction: TransactionResponse;
  const keyPair = createKeyPair();

  beforeEach(async () => {
    ({wallet, publicResolver, registrarAddress, ensAddress, providerWithENS} = await loadFixture(basicENS));
    gnosisSafe = await deployGnosisSafe(wallet);
    proxyFactory = await deployProxyFactory(wallet);
    ensRegistrar = await deployContract(wallet, ENSRegistrar as any);
    const args = [hashLabel, name, node, ensAddress, registrarAddress, publicResolver];
    const data = new utils.Interface(ENSRegistrar.interface as any).functions.register.encode(args);
    const deployment = {
      owners: [keyPair.publicKey],
      requiredConfirmations: INITIAL_REQUIRED_CONFIRMATIONS,
      deploymentCallAddress: ensRegistrar.address,
      deploymentCallData: data,
      fallbackHandler: AddressZero,
      paymentToken: ETHER_NATIVE_TOKEN.address,
      payment: '0',
      refundReceiver: wallet.address,
    };
    const setupData = encodeDataForSetup(deployment);
    computedAddress = computeGnosisCounterfactualAddress(proxyFactory.address, 0, setupData, gnosisSafe.address);
    await wallet.sendTransaction({to: computedAddress, value: utils.parseEther('10')});
    deploymentTransaction = await proxyFactory.createProxyWithNonce(gnosisSafe.address, setupData, 0);
  });

  it('deploys proxy and registers ENS name', async () => {
    const receipt = await providerWithENS.getTransactionReceipt(deploymentTransaction.hash!);
    const addressFromEvent = receipt.logs && receipt.logs[0].data;
    const contractAsProxy = new Contract(computedAddress, IProxyInterface, providerWithENS);
    expect(await contractAsProxy.masterCopy()).to.eq(gnosisSafe.address);
    expect(addressFromEvent).to.include(removeHexStringPrefix(computedAddress).toLowerCase());
    expect(await providerWithENS.lookupAddress(computedAddress)).to.eq(name);
    expect(await providerWithENS.resolveName('alex.mylogin.eth')).to.eq(computedAddress);
  });

  it('sends ether', async () => {
    const message = {
      from: computedAddress,
      to: TEST_ACCOUNT_ADDRESS,
      value: utils.parseEther('1'),
      nonce: '0',
      gasLimit: utils.bigNumberify(120000),
      gasPrice: '1',
      gasToken: ETHER_NATIVE_TOKEN.address,
      operationType: OperationType.call,
      refundReceiver: wallet.address,
    };
    const signedMessage = messageToSignedMessage(message, keyPair.privateKey, 'istanbul', 'beta3');
    const dataToSend = encodeDataForExecTransaction(signedMessage);
    await wallet.sendTransaction({to: computedAddress, data: dataToSend});
    expect(await providerWithENS.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(message.value);
  });
});

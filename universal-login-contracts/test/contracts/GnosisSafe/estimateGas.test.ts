import {expect} from 'chai';
import {Wallet, Contract, providers, utils} from 'ethers';
import {getWallets, loadFixture} from 'ethereum-waffle';
import {createKeyPair, KeyPair, ETHER_NATIVE_TOKEN, TEST_GAS_PRICE, OperationType, CURRENT_NETWORK_VERSION, Message, TEST_ACCOUNT_ADDRESS, deployContract} from '@unilogin/commons';
import {GnosisSafeInterface} from '../../../src/gnosis-safe@1.1.1/interfaces';
import {executeAddKey, setupGnosisSafeContractFixture} from '../../fixtures/gnosisSafe';
import {messageToSignedMessage, encodeDataForExecTransaction, getPreviousOwner} from '../../../src';
import {MockDai} from '../../helpers/mockContracts';

const getData = (message: Partial<Message>, privateKey: string) => {
  const signedMsg = messageToSignedMessage(message, privateKey, CURRENT_NETWORK_VERSION, 'beta3');
  return encodeDataForExecTransaction(signedMsg);
}

describe('INT: estimate gas', async () => {
  let wallet: Wallet;
  let proxy: Contract;
  let proxyAsGnosisSafe: Contract;
  let proxyContract: Contract;
  let keyPair: KeyPair;
  let provider: providers.Provider;

  beforeEach(async () => {
    ({proxy, keyPair, provider} = await loadFixture(setupGnosisSafeContractFixture));

    [wallet] = getWallets(provider);
    proxyAsGnosisSafe = new Contract(proxy.address, GnosisSafeInterface, wallet.provider);
    proxyContract = new Contract(proxy.address, GnosisSafeInterface, wallet.provider);
  });

  it('add key', async () => {
    const keyToAdd = Wallet.createRandom().address;
    const requiredSign = await proxyContract.getThreshold();
    const msg = {
      to: proxy.address,
      from: proxy.address,
      data: GnosisSafeInterface.functions.addOwnerWithThreshold.encode([keyToAdd, requiredSign]),
      nonce: await proxyContract.nonce(),
      gasToken: ETHER_NATIVE_TOKEN.address,
      gasPrice: TEST_GAS_PRICE,
      gasLimit: '300000',
      operationType: OperationType.call,
      refundReceiver: wallet.address,
    };
    const estimatedGas = await provider.estimateGas({data: getData(msg, keyPair.privateKey), to: proxy.address, from: wallet.address});
    const newGasLimit = estimatedGas.add('17000');
    const dataWithEstimatedGas = getData({...msg, gasLimit: newGasLimit}, keyPair.privateKey)
    await wallet.sendTransaction({to: proxy.address, data: dataWithEstimatedGas, gasLimit: newGasLimit.add('10000')});
    expect(await proxyAsGnosisSafe.isOwner(keyToAdd)).to.be.true;
  });

  it('remove key', async () => {
    const keyPair2 = createKeyPair();
    await executeAddKey(wallet, proxyAsGnosisSafe.address, keyPair2.publicKey, keyPair.privateKey);
    expect(await proxyAsGnosisSafe.isOwner(keyPair2.publicKey)).to.be.true;
    const requiredSign = await proxyContract.getThreshold();
    const owners: string[] = await proxyContract.getOwners();
    const previousOwner = getPreviousOwner(owners, keyPair2.publicKey);
    const msg = {
      to: proxy.address,
      from: proxy.address,
      data: GnosisSafeInterface.functions.removeOwner.encode([previousOwner, keyPair2.publicKey, requiredSign]),
      nonce: await proxyContract.nonce(),
      gasToken: ETHER_NATIVE_TOKEN.address,
      gasPrice: TEST_GAS_PRICE,
      gasLimit: '300000',
      operationType: OperationType.call,
      refundReceiver: wallet.address,
    };
    const data = getData(msg, keyPair.privateKey);
    const estimatedGas = await provider.estimateGas({data, to: proxy.address, from: wallet.address});
    const newGasLimit = estimatedGas.add('35000');
    const dataWithEstimatedGas = getData({...msg, gasLimit: newGasLimit}, keyPair.privateKey);
    await wallet.sendTransaction({to: proxy.address, data: dataWithEstimatedGas, gasLimit: newGasLimit.add('10000')});
    expect(await proxyAsGnosisSafe.isOwner(keyPair2.publicKey)).to.be.false;
  });

  it('transfer ether', async () => {
    const value = utils.parseEther('0.05');
    await wallet.sendTransaction({to:TEST_ACCOUNT_ADDRESS, value})
    const msg = {
      to: TEST_ACCOUNT_ADDRESS,
      from: proxy.address,
      data: '0x0',
      nonce: await proxyContract.nonce(),
      gasToken: ETHER_NATIVE_TOKEN.address,
      gasPrice: TEST_GAS_PRICE,
      gasLimit: '300000',
      operationType: OperationType.call,
      refundReceiver: wallet.address,
      value,
    };
    const data = getData(msg, keyPair.privateKey);
    const estimatedGas = await provider.estimateGas({data, to: proxy.address, from: wallet.address});
    const newGasLimit = estimatedGas.add('10000');
    const dataWithEstimatedGas = getData({...msg, gasLimit: newGasLimit}, keyPair.privateKey);
    await wallet.sendTransaction({to: proxy.address, data: dataWithEstimatedGas, gasLimit: newGasLimit.add('30000')});
    const toBalance = await provider.getBalance(TEST_ACCOUNT_ADDRESS);
    expect(toBalance).to.eq(value.mul(2));

  });

  it('transfer token', async () => {
    const mockDai = await deployContract(wallet, MockDai);
    await mockDai.transfer(proxy.address, utils.parseEther('1'));
    const value = utils.parseEther('0.5');
    await mockDai.transfer(TEST_ACCOUNT_ADDRESS, value);
    const msg = {
      to: mockDai.address,
      from: proxy.address,
      data: new utils.Interface(MockDai.abi as any).functions.transfer.encode([TEST_ACCOUNT_ADDRESS, value.toString()]),
      nonce: await proxyContract.nonce(),
      gasToken: ETHER_NATIVE_TOKEN.address,
      gasPrice: TEST_GAS_PRICE,
      gasLimit: '300000',
      operationType: OperationType.call,
      refundReceiver: wallet.address,
    };
    const data = getData(msg, keyPair.privateKey);
    const estimatedGas = await provider.estimateGas({data, to: proxy.address, from: wallet.address});
    const newGasLimit = estimatedGas.add('20000');
    const dataWithEstimatedGas = getData({...msg, gasLimit: newGasLimit}, keyPair.privateKey);
    await wallet.sendTransaction({to: proxy.address, data: dataWithEstimatedGas, gasLimit: newGasLimit.add('30000')});
    const toBalance = await mockDai.balanceOf(TEST_ACCOUNT_ADDRESS);
    expect(toBalance).to.eq(value.mul(2));
  });
});

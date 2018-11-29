import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import EthereumIdentitySDK from '../../lib/sdk';
import {RelayerUnderTest} from 'universal-login-relayer';
import {createMockProvider, solidity, getWallets, deployContract} from 'ethereum-waffle';
import {Wallet, utils} from 'ethers';
import {MESSAGE_DEFAULTS} from '../../lib/config';
import MockToken from '../../../universal-login-contracts/build/MockToken';
import {MANAGEMENT_KEY, ECDSA_TYPE} from 'universal-login-contracts';

chai.use(solidity);
chai.use(sinonChai);

describe('SDK: BlockchainObserver', async () => {
  let provider;
  let relayer;
  let sdk;
  let blockchainObserver;
  let privateKey;
  let contractAddress;
  let wallet;
  let anotherWallet;
  let anotherWallet2;
  let token;

  before(async () => {
    provider = createMockProvider();
    relayer = await RelayerUnderTest.createPreconfigured(provider);
    [wallet, anotherWallet, anotherWallet2] = await getWallets(provider);
    await relayer.start();
    ({provider} = relayer);
    sdk = new EthereumIdentitySDK(relayer.url(), provider);
    ({blockchainObserver} = sdk);
    blockchainObserver.step = 50;
    [privateKey, contractAddress] = await sdk.create('alex.mylogin.eth');
    await sdk.start();
    token = await deployContract(wallet, MockToken, []);
    await token.transfer(contractAddress, utils.parseEther('20'));
  });

  it('subscribe: should emit AddKey on construction', async () => {
    const {address} = new Wallet(privateKey);
    const callback = sinon.spy();
    const filter = {contractAddress, key: address};
    await blockchainObserver.subscribe('KeyAdded', filter, callback);
    await blockchainObserver.fetchEvents(JSON.stringify(filter));
    expect(callback).to.have.been.calledWith({address, keyType: ECDSA_TYPE, purpose: MANAGEMENT_KEY});
  });

  it('subscribe: should emit AddKey on addKey', async () => {
    const callback = sinon.spy();
    const addKeyPaymentOption = {...MESSAGE_DEFAULTS, gasToken: token.address};
    const filter = {contractAddress, key: wallet.address};
    await blockchainObserver.subscribe('KeyAdded', filter, callback);
    await sdk.addKey(contractAddress, wallet.address, privateKey, addKeyPaymentOption);
    await blockchainObserver.fetchEvents(JSON.stringify({contractAddress, key: wallet.address}));
    expect(callback).to.have.been.calledWith({address: wallet.address, keyType: ECDSA_TYPE, purpose: MANAGEMENT_KEY});
  });

  it('subscribe: shouldn`t emit AddKey on add another key', async () => {
    const callback = sinon.spy();
    const callback2 = sinon.spy();
    const addKeyPaymentOption = {...MESSAGE_DEFAULTS, gasToken: token.address};

    const filter = {contractAddress, key: anotherWallet.address};
    const filter2 = {contractAddress, key: anotherWallet2.address};
    await blockchainObserver.subscribe('KeyAdded', filter,  callback);
    await blockchainObserver.subscribe('KeyAdded', filter2, callback2);

    await sdk.addKey(contractAddress, anotherWallet.address, privateKey, addKeyPaymentOption);
    await blockchainObserver.fetchEvents(JSON.stringify(filter));

    expect(callback).to.have.been.calledWith({address: anotherWallet.address, keyType: ECDSA_TYPE, purpose: MANAGEMENT_KEY});
    expect(callback2).to.not.have.been.called;
  });

  it('subscribe: should emit RemoveKey on removeKey', async () => {
    const callback = sinon.spy();
    const addKeyPaymentOption = {...MESSAGE_DEFAULTS, gasToken: token.address};
    await sdk.addKey(contractAddress, wallet.address, privateKey, addKeyPaymentOption);
    const filter = {contractAddress, key: wallet.address};
    await blockchainObserver.subscribe('KeyRemoved', filter, callback);
    const removeKeyPaymentOption = {...MESSAGE_DEFAULTS, gasToken: token.address};
    await sdk.removeKey(contractAddress, wallet.address, privateKey, removeKeyPaymentOption);
    await blockchainObserver.fetchEvents(JSON.stringify(filter));
    expect(callback).to.have.been.calledWith({address: wallet.address, keyType: ECDSA_TYPE, purpose: MANAGEMENT_KEY});
  });

  after(async () => {
    await relayer.stop();
    sdk.stop();
  });
});

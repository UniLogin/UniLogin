import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import EthereumIdentitySDK from '../../lib/sdk';
import {RelayerUnderTest} from 'universal-login-relayer';
import {createMockProvider, solidity, getWallets, deployContract} from 'ethereum-waffle';
import {Wallet, utils} from 'ethers';
import DEFAULT_PAYMENT_OPTIONS from '../../lib/config';
import MockToken from '../../../universal-login-contracts/build/MockToken';

chai.use(solidity);
chai.use(sinonChai);

describe('SDK: BlockchainObserver', async () => {
  let provider;
  let relayer;
  let sdk;
  let blockchainObserver;
  let privateKey;
  let identityAddress;
  let wallet;
  let token;

  before(async () => {
    provider = createMockProvider();
    relayer = await RelayerUnderTest.createPreconfigured(provider);
    [wallet] = await getWallets(provider);
    await relayer.start();
    ({provider} = relayer);
    sdk = new EthereumIdentitySDK(relayer.url(), provider);
    ({blockchainObserver} = sdk);
    blockchainObserver.step = 50;
    [privateKey, identityAddress] = await sdk.create('alex.mylogin.eth');
    await sdk.start();
    token = await deployContract(wallet, MockToken, []);
    await token.transfer(identityAddress, utils.parseEther('20'));
  });

  it('subscribe: should emit AddKey on construction', async () => {
    const {address} = new Wallet(privateKey);
    const callback = sinon.spy();
    await blockchainObserver.subscribe('KeyAdded', identityAddress, callback);
    await blockchainObserver.fetchEvents(identityAddress);
    expect(callback).to.have.been.calledWith({address, keyType: 1, purpose: 1});
  });

  it('subscribe: should emit AddKey on addKey', async () => {
    const callback = sinon.spy();
    await blockchainObserver.subscribe('KeyAdded', identityAddress, callback);
    const addKeyPaymentOption = {...DEFAULT_PAYMENT_OPTIONS, gasToken: token.address};
    await sdk.addKey(identityAddress, wallet.address, privateKey, addKeyPaymentOption);
    await blockchainObserver.fetchEvents(identityAddress);
    expect(callback).to.have.been.calledWith({address: wallet.address, keyType: 1, purpose: 1});
  });

  it('subscribe: should emit RemoveKey on removeKey', async () => {
    const callback = sinon.spy();
    await blockchainObserver.subscribe('KeyRemoved', identityAddress, callback);
    const removeKeyPaymentOption = {...DEFAULT_PAYMENT_OPTIONS, gasToken: token.address};
    await sdk.removeKey(identityAddress, wallet.address, privateKey, removeKeyPaymentOption);
    await blockchainObserver.fetchEvents(identityAddress);
    expect(callback).to.have.been.calledWith({address: wallet.address, keyType: 1, purpose: 1});
  });

  after(async () => {
    await relayer.stop();
    sdk.stop();
  });
});

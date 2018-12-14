import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import EthereumIdentitySDK from 'universal-login-sdk/lib/sdk';
import {RelayerUnderTest} from 'universal-login-relayer';
import {createMockProvider, getWallets, solidity, deployContract} from 'ethereum-waffle';
import {utils} from 'ethers';
import sinon from 'sinon';
import MESSAGE_DEFAULTS from '../lib/config';
import MockToken from '../../universal-login-contracts/build/MockToken';

chai.use(solidity);
chai.use(sinonChai);

describe('SDK - events', async () => {
  let provider;
  let relayer;
  let sdk;
  let contractAddress;
  let wallet;
  let privateKey;
  let sponsor;
  let token;

  before(async () => {
    provider = createMockProvider();
    [wallet, sponsor] = await getWallets(provider);
    relayer = await RelayerUnderTest.createPreconfigured(provider);
    await relayer.start();
    ({provider} = relayer);
    sdk = new EthereumIdentitySDK(relayer.url(), provider);
    [privateKey, contractAddress] = await sdk.create('alex.mylogin.eth');
    await sponsor.sendTransaction({to: contractAddress, value: 10000});
    token = await deployContract(wallet, MockToken, []);
    await token.transfer(contractAddress, utils.parseEther('20'));
  });


  it('create, request connection, addKey roundtrip', async () => {
    const connectionCallback = sinon.spy();
    const keyCallback = sinon.spy();

    sdk.start();

    await sdk.subscribe('AuthorisationsChanged', {contractAddress}, connectionCallback);
    await sdk.subscribe('KeyAdded', {contractAddress, key: wallet.address}, keyCallback);

    await sdk.connect(contractAddress);
    const addKeyPaymentOption = {...MESSAGE_DEFAULTS, gasToken: token.address};
    await sdk.addKey(contractAddress, wallet.address, privateKey, addKeyPaymentOption);
    await sdk.finalizeAndStop();
    expect(keyCallback).to.have.been.calledWith({key: wallet.address.toLowerCase(), keyType: 1, purpose: 1});
    expect(connectionCallback).to.have.been.called;
  });

  after(async () => {
    await relayer.stop();
  });
});

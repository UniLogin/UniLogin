import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, {expect} from 'chai';
import {Wallet, utils} from 'ethers';
import {createFixtureLoader} from 'ethereum-waffle';
import basicSDK from '../fixtures/basicSDK';
import UniversalLoginSDK from '../../lib/sdk';
import { CancelAuthorisationRequest, GetAuthorisationRequest, signCancelAuthorisationRequest, signGetAuthorisationRequest, createKeyPair } from '@universal-login/commons';
import { RelayerUnderTest } from '@universal-login/relayer';

const loadFixture = createFixtureLoader();

chai.use(sinonChai);

describe('E2E authorization - sdk <=> relayer', async () => {
  let relayer: RelayerUnderTest;
  let sdk: UniversalLoginSDK;
  let contractAddress: string;
  let privateKey: string;
  let otherWallet: any;

  beforeEach(async () => {
    ({sdk, privateKey, contractAddress, relayer, otherWallet} = await loadFixture(basicSDK));
    sdk.relayerObserver.step = 10;
  });

  it('Send valid cancel request', async () => {
    const {publicKey} = createKeyPair();
    await sdk.relayerApi.connect(contractAddress, publicKey.toLowerCase());

    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      publicKey,
      signature: ''
    };

    signCancelAuthorisationRequest(cancelAuthorisationRequest, privateKey);
    const {body, status} = await chai.request(relayer.url())
      .post(`/authorisation/${contractAddress}`)
      .send({cancelAuthorisationRequest});

    expect(status).to.eq(204);
    expect(body).to.deep.eq({});
  });

  it('Send forged cancel request', async () => {
    const {sdk, privateKey, contractAddress, relayer, otherWallet} = await loadFixture(basicSDK);
    const attackerPrivateKey = Wallet.createRandom().privateKey;
    const attackerAddress = utils.computeAddress(attackerPrivateKey);
    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      publicKey: otherWallet.address,
      signature: ''
    };

    signCancelAuthorisationRequest(cancelAuthorisationRequest, attackerPrivateKey);
    const {body, status} = await chai.request(relayer.url())
      .post(`/authorisation/${contractAddress}`)
      .send({cancelAuthorisationRequest});

    expect(status).to.eq(401);
    expect(body.type).to.eq('UnauthorisedAddress');
    expect(body.error).to.eq(`Error: Unauthorised address: ${attackerAddress}`);
  });

  it('Valid getPending request', async () => {
    const callback = sinon.spy();
    sdk.relayerObserver.start();
    const getAuthorisationRequest: GetAuthorisationRequest = {
      walletContractAddress: contractAddress,
      signature: ''
    };

    signGetAuthorisationRequest(getAuthorisationRequest, privateKey);

    const subscription = await sdk.relayerObserver.subscribe('AuthorisationsChanged', {contractAddress, signature: getAuthorisationRequest.signature}, callback);
    await sdk.connect(contractAddress);
    await sdk.relayerObserver.finalizeAndStop();
    subscription.remove();
    expect(callback).to.have.been.calledOnce;
  });
  
  // it('Forged getPending request', async () => {
  //   const callback = sinon.spy();
  //   sdk.relayerObserver.start();
  //   const getAuthorisationRequest: GetAuthorisationRequest = {
  //     walletContractAddress: contractAddress,
  //     signature: ''
  //   };

  //   const attackerPrivateKey = Wallet.createRandom().privateKey;
  //   signGetAuthorisationRequest(getAuthorisationRequest, attackerPrivateKey);

  //   const subscribtion = await sdk.relayerObserver.subscribe('AuthorisationsChanged', {contractAddress, signature: getAuthorisationRequest.signature}, callback);
  //   await sdk.connect(contractAddress);
  //   await sdk.relayerObserver.finalizeAndStop();
  //   subscribtion.remove();
  //   expect(callback).to.have.not.been.called;
  // });



  afterEach(async () => {
    await relayer.clearDatabase();
  });

  after(async () => {
    await relayer.stop();
  });
});

import chai, {expect} from 'chai';
import {Wallet, utils} from 'ethers';
import {createFixtureLoader} from 'ethereum-waffle';
import basicSDK from '../fixtures/basicSDK';
import UniversalLoginSDK from '../../lib/sdk';
import { CancelAuthorisationRequest, signCancelAuthorisationRequest, createKeyPair } from '@universal-login/commons';
import { RelayerUnderTest } from '@universal-login/relayer';

const loadFixture = createFixtureLoader();

describe('E2E authorization - sdk <=> relayer', async () => {
  let relayer: RelayerUnderTest;
  let sdk: UniversalLoginSDK;
  let contractAddress: string;
  let privateKey: string;
  let otherWallet: any;
  let mockToken: any;
  let walletContract: any;

  beforeEach(async () => {
    ({sdk, privateKey, contractAddress, relayer, otherWallet, walletContract, mockToken} = await loadFixture(basicSDK));
  });

  afterEach(async () => {
    await relayer.clearDatabase();
  });

  after(async () => {
    await relayer.stop();
  });

  it('Send cancel request but no added key before canceling it.', async () => {
    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      publicKey: otherWallet.address,
      signature: ''
    };

    signCancelAuthorisationRequest(cancelAuthorisationRequest, privateKey);
    const {body, status} = await chai.request(relayer.url())
      .post(`/authorisation/${contractAddress}`)
      .send({cancelAuthorisationRequest});

    expect(status).to.eq(401);
    expect(body.type).to.eq('AuthorisationKeyNotfound');
    expect(body.error).to.eq(`Error: Could not find key ${otherWallet.address} to authorise`);
  });

  it('Send valid cancel request', async () => {
    const {publicKey} = createKeyPair();
    await sdk.relayerApi.connect(contractAddress, publicKey.toLowerCase());
    await sdk.connect(contractAddress);

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
});


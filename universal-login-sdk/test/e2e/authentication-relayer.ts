import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, {expect} from 'chai';
import {Wallet, utils} from 'ethers';
import {createFixtureLoader} from 'ethereum-waffle';
import basicSDK from '../fixtures/basicSDK';
import UniversalLoginSDK from '../../lib/sdk';
import { waitUntil, CancelAuthorisationRequest, GetAuthorisationRequest, signCancelAuthorisationRequest, signGetAuthorisationRequest, createKeyPair , recoverFromGetAuthorisationRequest} from '@universal-login/commons';
import { RelayerUnderTest } from '@universal-login/relayer';

const loadFixture = createFixtureLoader();

chai.use(sinonChai);

describe('E2E authorization - sdk <=> relayer', async () => {
  let relayer: RelayerUnderTest;
  let sdk: UniversalLoginSDK;
  let contractAddress: string;
  let privateKey: string;
  let otherWallet: any;

  const createGetAuthorisationRequest = (walletContractAddress: string, privateKey: string) => {
    walletContractAddress.toLowerCase()
    const getauthorisationRequest: GetAuthorisationRequest = {
      walletContractAddress,
      signature: ''
    };
    signGetAuthorisationRequest(getauthorisationRequest, privateKey);
    return getauthorisationRequest;
  };

  beforeEach(async () => {
    ({sdk, privateKey, contractAddress, relayer, otherWallet} = await loadFixture(basicSDK));
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
    const {publicKey} = createKeyPair();
    await sdk.relayerApi.connect(contractAddress, publicKey.toLowerCase());

    const getAuthorisationRequest = createGetAuthorisationRequest(contractAddress, privateKey);
    const {walletContractAddress, signature} = getAuthorisationRequest;
    const {body, status} = await chai.request(relayer.url())
      .get(`/authorisation/${walletContractAddress}?signature=${signature}`);

    expect(status).to.eq(200);
    expect(body.response.length).to.eq(1);
  });

  it('Forged getPending request', async () => {
    const {publicKey} = createKeyPair();
    await sdk.relayerApi.connect(contractAddress, publicKey.toLowerCase());

    const {privateKey: attackerPrivateKey} = createKeyPair();

    const forgedGetAuthorisationRequest = createGetAuthorisationRequest(contractAddress, attackerPrivateKey);
    const {walletContractAddress, signature} = forgedGetAuthorisationRequest;

    const {body, status} = await chai.request(relayer.url())
      .get(`/authorisation/${walletContractAddress}?signature=${signature}`);

    expect(status).to.eq(401);
    expect(body.type).to.eq('UnauthorisedAddress');
  });

  afterEach(async () => {
    await relayer.clearDatabase();
  });

  after(async () => {
    await relayer.stop();
  });
});

import chai, {expect} from 'chai';
import {Wallet, utils} from 'ethers';
import {createFixtureLoader} from 'ethereum-waffle';
import {CancelAuthorisationRequest, signCancelAuthorisationRequest} from '@universal-login/commons';
import basicSDK from './fixtures/basicSDK';
import UniversalLoginSDK from '../lib/sdk';
import { RelayerUnderTest } from '@universal-login/relayer';

const loadFixture = createFixtureLoader();

describe('E2E authorization - sdk <=> relayer', async () => {
  let relayer: RelayerUnderTest;
  let sdk: UniversalLoginSDK;
  let contractAddress: string;
  let privateKey: string;


  beforeEach(async () => {
    ({sdk, privateKey, contractAddress, relayer} = await loadFixture(basicSDK));
  });

  afterEach(async () => {
    await relayer.clearDatabase();
  });

  it('Send valid cancel request', async () => {
    const userAddress = utils.computeAddress(privateKey);
    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      publicKey: userAddress,
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
      publicKey: attackerAddress,
      signature: ''
    };

    signCancelAuthorisationRequest(cancelAuthorisationRequest, attackerPrivateKey);
    const result = await chai.request(relayer.url())
      .post(`/authorisation/${contractAddress}`)
      .send({cancelAuthorisationRequest});

    expect(result.status).to.eq(401);
    expect(result.body.type).to.eq('UnauthorisedAddress');
    expect(result.body.error).to.eq(`Error: Unauthorised address: ${attackerAddress}`);
  });

  after(async () => {
    await relayer.stop();
  });
});

import {expect} from 'chai';
import {Wallet, utils} from 'ethers';
import {createFixtureLoader} from 'ethereum-waffle';
import basicSDK from './fixtures/basicSDK';
import UniversalLoginSDK from '../lib/sdk';
import { CancelAuthorisationRequest } from '@universal-login/commons/lib';

const loadFixture = createFixtureLoader();

describe('E2E authorization - sdk <=> relayer', async () => {
  let relayer: any;
  let sdk: UniversalLoginSDK;
  let contractAddress: any;
  let privateKey: any;

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
    await expect(sdk.denyRequest(cancelAuthorisationRequest, privateKey)).to.be.eventually.fulfilled;
  });

  it('Send forged cancel request', async () => {
    const attackerPrivateKey = Wallet.createRandom().privateKey;
    const attackerAddress = utils.computeAddress(attackerPrivateKey);
    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      publicKey: attackerAddress,
      signature: ''
    };
    await expect(sdk.denyRequest(cancelAuthorisationRequest, attackerPrivateKey))
      .to.be.eventually.rejectedWith(`Error: Unauthorised address: ${attackerAddress}`);
  });

  after(async () => {
    await relayer.stop();
  });
});

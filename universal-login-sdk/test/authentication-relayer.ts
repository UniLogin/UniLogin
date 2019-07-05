import {expect} from 'chai';
import {Wallet, utils} from 'ethers';
import {createFixtureLoader} from 'ethereum-waffle';
import basicSDK from './fixtures/basicSDK';
import UniversalLoginSDK from '../lib/sdk';
// import {InvalidSignature, InvalidAddress} from '@universal-login/relayer';

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
    await expect(sdk.denyRequest(contractAddress, userAddress, privateKey)).to.be.eventually.fulfilled;
  });

  it('Send forged cancel request with valid signature', async () => {
    const attackerPrivateKey = Wallet.createRandom().privateKey;
    const attackerAddress = utils.computeAddress(attackerPrivateKey);
    await expect(sdk.denyRequest(contractAddress, attackerAddress, attackerPrivateKey))
      .to.be.eventually.rejected;
      // With(`Error: Could not find address: ${attackerAddress} in Multisig Wallet`);
  });

  it('Send cancel request with invalid signature', async () => {
    const userAddress = utils.computeAddress(privateKey);
    const attackerPrivateKey = Wallet.createRandom().privateKey;
    await expect(sdk.denyRequest(contractAddress, userAddress, attackerPrivateKey))
      .to.be.eventually.rejected;
      // With(`Invalid signature cancelAuthorisationRequest failed due to invalid signature`);
  });

  after(async () => {
    await relayer.stop();
  });
});

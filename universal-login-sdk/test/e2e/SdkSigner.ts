import {expect} from 'chai';
import {utils} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import basicSDK from '../fixtures/basicSDK';
import {SdkSigner} from '../../lib/api/SdkSigner';

describe('E2E: SdkSigner', () => {
  let relayer: any;

  before(async () => {
    ({relayer} = await loadFixture(basicSDK));
  });

  after(async () => {
    await relayer.stop();
  });

  it('can be created', async () => {
    const {sdk, contractAddress, privateKey} = await loadFixture(basicSDK);
    const signer = new SdkSigner(sdk, contractAddress, privateKey);

    expect(signer).not.to.equal(undefined);
  });

  it('can query balance', async () => {
    const {sdk, contractAddress, privateKey, mockToken} = await loadFixture(basicSDK);
    const signer = new SdkSigner(sdk, contractAddress, privateKey);

    const contract = mockToken.connect(signer);
    const balance = await contract.balanceOf(signer.contractAddress);

    expect(balance).to.deep.equal(utils.parseEther('1'));
  });

  it('can send transactions through ethers contract', async () => {
    const {sdk, contractAddress, privateKey, mockToken, otherWallet} = await loadFixture(basicSDK);
    const signer = new SdkSigner(sdk, contractAddress, privateKey);

    // gasToken should be configured when creating SDK instance in order to use the signer
    sdk.sdkConfig.paymentOptions.gasToken = mockToken.address;

    const contract = mockToken.connect(signer);
    await contract.transfer(otherWallet.address, utils.parseEther('0.5'));
    const balance = await contract.balanceOf(signer.contractAddress);

    expect(balance.lt(utils.parseEther('0.5'))).to.equal(true);
  });
});

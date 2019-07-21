import {expect} from 'chai';
import {createFixtureLoader} from 'ethereum-waffle';
import {utils, providers} from 'ethers';
import basicSDK from '../fixtures/basicSDK';
import UniversalLoginSDK from '../../lib/api/sdk';
import {RelayerUnderTest} from '@universal-login/relayer';
import {isValidCode, isProperSecurityCode} from '@universal-login/commons';

const loadFixture = createFixtureLoader();

describe('E2E: connecting', async () => {
  let provider: providers.Provider;
  let relayer: RelayerUnderTest;
  let sdk: UniversalLoginSDK;
  let contractAddress: string;
  let sdk2: UniversalLoginSDK;


  beforeEach(async () => {
    ({provider, sdk, contractAddress, relayer} = await loadFixture(basicSDK));
    sdk2 = new UniversalLoginSDK(relayer.url(), provider);
  });

  it('security code roundtrip', async () => {
    const {privateKey, securityCode} = await sdk2.connect(contractAddress);
    const publicKey = utils.computeAddress(privateKey);
    expect(isValidCode(securityCode, publicKey)).to.be.true;

    securityCode[0] = (securityCode[0] + 1) % 1024;
    expect(isValidCode(securityCode, publicKey)).to.be.false;
  });

  it('sdk.connect() should return security code - array of 6 numbers (10bit)', async () => {
    const {securityCode} = await sdk.connect(contractAddress);
    expect(isProperSecurityCode(securityCode)).to.be.true;
  });

  after(async () => {
    await relayer.stop();
  });
});

import {expect} from 'chai';
import {createFixtureLoader} from 'ethereum-waffle';
import {utils, providers} from 'ethers';
import basicSDK from '../fixtures/basicSDK';
import UniLoginSdk from '../../src/api/sdk';
import {RelayerUnderTest} from '@unilogin/relayer';
import {isValidCode, isProperSecurityCode, TEST_SDK_CONFIG} from '@unilogin/commons';

const loadFixture = createFixtureLoader();

describe('INT: SDK connecting', () => {
  let provider: providers.JsonRpcProvider;
  let relayer: RelayerUnderTest;
  let sdk: UniLoginSdk;
  let contractAddress: string;
  let sdk2: UniLoginSdk;

  beforeEach(async () => {
    ({provider, sdk, contractAddress, relayer} = await loadFixture(basicSDK));
    sdk2 = new UniLoginSdk(relayer.url(), provider, TEST_SDK_CONFIG);
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

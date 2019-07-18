import {expect} from 'chai';
import {createFixtureLoader} from 'ethereum-waffle';
import {utils, providers} from 'ethers';
import basicSDK from '../fixtures/basicSDK';
import UniversalLoginSDK from '../../lib/sdk';
import {RelayerUnderTest} from '@universal-login/relayer';
import {generateCodeWithFakes, isValidCode} from '@universal-login/commons';

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

    const isCodeValid = await isValidCode(securityCode, publicKey);
    expect(isCodeValid).to.be.true;

    const securityCodeWithFakes = generateCodeWithFakes(publicKey);
    securityCodeWithFakes[0] = 1024;
    const enteredCode = securityCodeWithFakes.slice(0, 6);
    const isCodeValid2 = await isValidCode(enteredCode, publicKey);
    expect(isCodeValid2).to.be.false;
  });

  it('sdk.connect() should return security code - array of 6 numbers (10bit)', async () => {
    const toBeProperCodeNumber = (code: number) => {
      return 0 <= code && code < 1024;
    };

    const toBeProperSecurityCode = (securityCode: number[]) => {
      return securityCode.length === 6 &&
              securityCode.every((e: number) => toBeProperCodeNumber(e));
    };

    const {securityCode} = await sdk.connect(contractAddress);
    const isProperSecurityCode = toBeProperSecurityCode(securityCode);
    expect(isProperSecurityCode).to.be.true;
  });

  after(async () => {
    await relayer.stop();
  });
});

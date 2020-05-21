import {Wallet} from 'ethers';
import {TEST_SDK_CONFIG, ETHER_NATIVE_TOKEN, TEST_TOKEN_PRICE_IN_ETH} from '@unilogin/commons';
import {mockGasPriceOracle} from '@unilogin/commons/testutils';
import {RelayerUnderTest} from '@unilogin/relayer';
import UniLoginSdk from '../../src/api/sdk';
import {SdkConfig} from '../../src';

export async function setupSdk(deployer: Wallet, overridePort = '33111', overrideSdkConfig?: Partial<SdkConfig>) {
  const {relayer, mockToken} = await RelayerUnderTest.createPreconfigured(deployer, overridePort);
  await relayer.start();
  const {provider} = relayer;
  (provider as any).pollingInterval = 10;
  const sdk = new UniLoginSdk(relayer.url(), provider, {...TEST_SDK_CONFIG, observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, mockToken.address], ...overrideSdkConfig});
  mockGasPriceOracle(sdk.gasPriceOracle);
  sdk.priceObserver.getCurrentPrices = () => Promise.resolve({ETH: {USD: 100, ETH: 1}, DAI: {ETH: TEST_TOKEN_PRICE_IN_ETH, USD: 0.95}} as any);
  await sdk.fetchRelayerConfig();
  return {sdk, relayer, provider, mockToken};
}

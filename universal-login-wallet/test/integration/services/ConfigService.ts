import chai, {expect} from 'chai';
import {getWallets, createMockProvider, solidity} from 'ethereum-waffle';
import Relayer from '@universal-login/relayer';
import UniversalLoginSDK from '@universal-login/sdk';
import {setupSdk} from '@universal-login/sdk/testutils';
import {ConfigService} from '../../../src/core/services/ConfigService';
import {PublicRelayerConfig} from '@universal-login/commons';

chai.use(solidity);

describe('INT: ConfigService', async () => {
  let sdk: UniversalLoginSDK;
  let relayer: Relayer;
  let relayerConfig: PublicRelayerConfig | undefined;

  before(async () => {
    const [wallet] = await getWallets(createMockProvider());
    ({sdk, relayer} = await setupSdk(wallet));
    relayerConfig = await sdk.getRelayerConfig();
  });

  it('Get uncached config', async () => {
    const configService = new ConfigService(sdk);
    expect(configService.getRelayerConfig()).to.be.undefined;
  });

  it('Cache and get config', async () => {
    const configService = new ConfigService(sdk);
    await configService.setRelayerConfig();
    expect(configService.getRelayerConfig()).to.eq(relayerConfig);
  });

  after(async () => {
    await relayer.stop();
  });
});

import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {startRelayer} from '../helpers/http';
import {getPublicConfig} from '../../lib/http/routes/config';
import {RelayerUnderTest} from '../../lib';
import {PublicRelayerConfig} from '@universal-login/commons';

chai.use(chaiHttp);

describe('E2E: Relayer - Config routes', async () => {
  let relayer: RelayerUnderTest;

  before(async () => {
    ({relayer} = await startRelayer());
  });

  it('should return public config', async () => {
    const {supportedTokens, chainSpec, factoryAddress, contractWhiteList, localization, onRampProviders, maxGasLimit, ipGeolocationApi} = relayer.getConfig();
    const expectedConfig: PublicRelayerConfig = {
      supportedTokens,
      chainSpec,
      factoryAddress,
      contractWhiteList,
      localization,
      onRampProviders,
      maxGasLimit,
      ipGeolocationApi
    };
    const result = await chai.request(relayer.getServer())
      .get('/config');
    expect(result.body.config).to.be.deep.eq(expectedConfig);
  });


  it('getPublicConfig should return PublicConfig', () => {
    const {supportedTokens, chainSpec, factoryAddress, contractWhiteList, localization, onRampProviders, maxGasLimit, ipGeolocationApi} = relayer.getConfig();
    const expectedConfig: PublicRelayerConfig = {
      supportedTokens,
      chainSpec,
      factoryAddress,
      contractWhiteList,
      localization,
      onRampProviders,
      maxGasLimit,
      ipGeolocationApi
    };
    const publicConfig = getPublicConfig(relayer.getConfig());

    expect(publicConfig).to.be.deep.eq(expectedConfig);
  });

  after(async () => {
    await relayer.stop();
  });
});

import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {normalizeSupportedTokens} from '@universal-login/commons';
import {startRelayer} from './helpers';
import {getPublicConfig} from '../../../lib/routes/config';

chai.use(chaiHttp);

describe('E2E: Relayer - Config routes', async () => {
  let relayer;

  before(async () => {
    ({relayer} = await startRelayer());
  });

  it('should return public config', async () => {
    const {supportedTokens, chainSpec, factoryAddress} = relayer.config;
    const expectedConfig = {
      supportedTokens,
      chainSpec,
      factoryAddress
    };
    const result = await chai.request(relayer.server)
      .get('/config');
    const config = {
      ...result.body.config, 
      supportedTokens: normalizeSupportedTokens(result.body.config.supportedTokens)
    };
    expect(config).to.be.deep.eq(expectedConfig);
  });


  it('getPublicConfig should return PublicConfig', () => {
    const {supportedTokens, chainSpec, factoryAddress} = relayer.config;
    const expectedConfig = {
      supportedTokens,
      chainSpec,
      factoryAddress
    };
    const publicConfig = getPublicConfig(relayer.config);
    expect(publicConfig).to.be.deep.eq(expectedConfig);
  });

  after(async () => {
    await relayer.stop();
  });
});

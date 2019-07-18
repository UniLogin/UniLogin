import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {startRelayer} from '../helpers/http';
import {getPublicConfig} from '../../lib/http/routes/config';

chai.use(chaiHttp);

describe('E2E: Relayer - Config routes', async () => {
  let relayer;

  before(async () => {
    ({relayer} = await startRelayer());
  });

  it('should return public config', async () => {
    const {supportedTokens, chainSpec, factoryAddress, contractWhiteList} = relayer.config;
    const expectedConfig = {
      supportedTokens,
      chainSpec,
      factoryAddress,
      contractWhiteList
    };
    const result = await chai.request(relayer.server)
      .get('/config');
    expect(result.body.config).to.be.deep.eq(expectedConfig);
  });


  it('getPublicConfig should return PublicConfig', () => {
    const {supportedTokens, chainSpec, factoryAddress, contractWhiteList} = relayer.config;
    const expectedConfig = {
      supportedTokens,
      chainSpec,
      factoryAddress,
      contractWhiteList
    };
    const publicConfig = getPublicConfig(relayer.config);

    expect(publicConfig).to.be.deep.eq(expectedConfig);
  });

  after(async () => {
    await relayer.stop();
  });
});

import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {startRelayer} from './helpers';
import { getPublicConfig } from '../../../lib/routes/config';

chai.use(chaiHttp);

describe('E2E: Relayer - Config routes', async () => {
  let relayer;

  before(async () => {
    ({relayer} = await startRelayer());
  });

  it('Config', async () => {
    const {supportedTokens, chainSpec, factoryAddress} = relayer.config;
    const expectedConfig = {
      supportedTokens,
      chainSpec,
      factoryAddress
    };
    const result = await chai.request(relayer.server)
      .get('/config');
    expect(result.body.config).to.be.deep.eq(expectedConfig);
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

import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import RelayerUnderTest from '../../helpers/relayerUnderTest';
import {createMockProvider} from 'ethereum-waffle';

chai.use(chaiHttp);

describe('Relayer - Config routes', async () => {
  let relayer;
  let provider;

  before(async () => {
    provider = createMockProvider();
    relayer = await RelayerUnderTest.createPreconfigured(provider);
    relayer.start();
  });

  it('Config', async () => {
    const expectedEnsAddress = relayer.config.chainSpec.ensAddress;
    const result = await chai.request(relayer.server)
      .get('/config');
    expect(result.body.config.ensAddress).to.eq(expectedEnsAddress);
  });

  after(async () => {
    relayer.stop();
  });
});

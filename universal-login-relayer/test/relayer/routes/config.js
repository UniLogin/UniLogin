import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import RelayerUnderTest from '../../../lib/utils/relayerUnderTest';
import {createMockProvider} from 'ethereum-waffle';
import {PostgreDB} from '../../../lib/utils/postgreDB';

chai.use(chaiHttp);

describe('Relayer - Config routes', async () => {
  let relayer;
  let database;
  let provider;

  before(async () => {
    provider = createMockProvider();
    database = new PostgreDB();
    relayer = await RelayerUnderTest.createPreconfigured(database, provider);
    await relayer.start();
  });

  it('Config', async () => {
    const expectedEnsAddress = relayer.config.chainSpec.ensAddress;
    const result = await chai.request(relayer.server)
      .get('/config');
    expect(result.body.config.ensAddress).to.eq(expectedEnsAddress);
  });

  after(async () => {
    await relayer.stop();
  });
});

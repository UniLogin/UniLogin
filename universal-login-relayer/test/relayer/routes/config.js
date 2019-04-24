import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {startRelayer} from './helpers';

chai.use(chaiHttp);

describe('E2E: Relayer - Config routes', async () => {
  let relayer;

  before(async () => {
    ({relayer} = await startRelayer());
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

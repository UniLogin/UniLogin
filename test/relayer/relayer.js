import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import Relayer from '../../lib/relayer/relayer';

chai.use(chaiAsPromised);
chai.use(chaiHttp);

const {expect} = chai;

describe('Relayer - Identity', async () => {
  let relayer;

  before(async () => {
    relayer = new Relayer();
    relayer.start();
  });

  it('create', async () => {
    const result = await chai.request(relayer.server).post('/identity');
    expect(result.body).to.deep.equal({result: 'ok'});
  });

  it('execute', async () => {
    const result = await chai.request(relayer.server).post('/identity/execute');
    expect(result.body).to.deep.equal({result: 'ok'});
  });

  after(async () => {
    relayer.stop();
  });
});

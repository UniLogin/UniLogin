import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import Relayer from '../../lib/relayer/relayer';
import {createMockProvider, defaultAccounts} from 'ethereum-waffle';


chai.use(chaiAsPromised);
chai.use(chaiHttp);

const {expect} = chai;

describe('Relayer - Identity routes', async () => {
  let relayer;

  before(async () => {
    relayer = new Relayer(createMockProvider(), defaultAccounts[9].secretKey);
    relayer.start();
  });

  it('create', async () => {
    const result = await chai.request(relayer.server)
      .post('/identity')
      .send({managementKey: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'});
    const {address} = result.body;
    expect(address).to.be.properAddress;
  });

  after(async () => {
    relayer.stop();
  });
});

import chai from 'chai';
import chaiHttp from 'chai-http';
import Relayer from '../../lib/relayer/relayer';
import {createMockProvider, defaultAccounts} from 'ethereum-waffle';
import {waitForContractDeploy} from '../../lib/utils/utils';
import Identity from '../../build/Identity';

chai.use(chaiHttp);

const {expect} = chai;

describe('Relayer - Identity routes', async () => {
  let relayer;
  let provider;

  before(async () => {
    provider = createMockProvider();
    relayer = new Relayer(provider, defaultAccounts[9].secretKey);
    relayer.start();
  });

  it('create', async () => {
    const result = await chai.request(relayer.server)
      .post('/identity')
      .send({managementKey: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'});
    const {transaction} = result.body;
    const contract = await waitForContractDeploy(provider, Identity, transaction.hash);
    expect(contract.address).to.be.properAddress;
  });

  after(async () => {
    relayer.stop();
  });
});

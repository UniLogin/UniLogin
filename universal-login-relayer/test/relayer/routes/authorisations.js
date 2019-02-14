import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import RelayerUnderTest from '../../../lib/utils/relayerUnderTest';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {waitForContractDeploy} from '../../../lib/utils/utils';
import Identity from 'universal-login-contracts/build/Identity';
import {PostgreDB} from '../../../lib/utils/postgreDB';

chai.use(chaiHttp);

describe('Relayer - Authorisation routes', async () => {
  let relayer;
  let database;
  let provider;
  let wallet;
  let otherWallet;
  let contract;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, otherWallet] = await getWallets(provider);
    database = new PostgreDB();
    relayer = await RelayerUnderTest.createPreconfigured(database, provider);
    await relayer.start();
    const result = await chai.request(relayer.server)
      .post('/identity')
      .send({
        managementKey: wallet.address,
        ensName: 'marek.mylogin.eth',
      });
    const {transaction} = result.body;
    contract = await waitForContractDeploy(wallet, Identity, transaction.hash);
  });

  it('add authorisation request and get authorisation request', async () => {
    const authorisationRequest = {
      identityAddress: contract.address,
      key: wallet.address,
    };

    const authorisationResult = await chai.request(relayer.server)
      .post('/authorisation')
      .send(authorisationRequest);

    expect(authorisationResult.status).to.eq(201);

    const getAuthorisationResult = await chai.request(relayer.server)
      .get(`/authorisation/${contract.address}`);
    const [getAuthorisationResponse] = getAuthorisationResult.body.response;

    expect(getAuthorisationResponse.key).to.eq(wallet.address.toLowerCase());
    expect(getAuthorisationResponse.id).to.eq(1);
    expect(getAuthorisationResponse.identityAddress).to.eq(contract.address);
    expect(getAuthorisationResponse.deviceInfo.city).to.eq('unknown');
  });

  it('get non-existing pending authorisations', async () => {
    const result = await chai.request(relayer.server)
      .get(`/authorisation/${otherWallet.address}`);
    expect(result.status).to.eq(200);
    expect(result.body.response).to.deep.eq([]);
  });

  it('response status should be 201 when deny request', async () => {
    const result = await chai.request(relayer.server)
      .post(`/authorisation/${contract.address}`)
      .send({
        key: wallet.address,
      });
    expect(result.status).to.eq(201);
  });

  afterEach(async () => {
    await relayer.stop();
  });
});

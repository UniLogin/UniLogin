import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {startRelayer, createWalletContract} from './helpers';

chai.use(chaiHttp);

describe('E2E: Relayer - Authorisation routes', async () => {
  let relayer;
  let provider;
  let wallet;
  let otherWallet;
  let contract;

  beforeEach(async () => {
    ({provider, wallet, otherWallet, relayer} = await startRelayer());
    contract = await createWalletContract(provider, relayer, wallet);
  });

  it('create and get authorisation', async () => {
    const result = await chai.request(relayer.server)
      .post('/authorisation')
      .send({
        walletContractAddress: contract.address,
        key: wallet.address,
      });
    expect(result.status).to.eq(201);

    const getAuthorisationResult = await chai.request(relayer.server)
      .get(`/authorisation/${contract.address}`);

    const [response] = getAuthorisationResult.body.response;
    expect(response).to.include({
      key: wallet.address.toLowerCase(),
      walletContractAddress: contract.address,
    });
    expect(response.deviceInfo).to.deep.include({
      city: 'unknown',
      ipAddress: '::ffff:127.0.0.1'
    });
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

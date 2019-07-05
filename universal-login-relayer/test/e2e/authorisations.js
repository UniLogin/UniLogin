import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {startRelayer, createWalletContract} from '../helpers/http';

chai.use(chaiHttp);

async function postAuthorisationRequest(relayer, contract, wallet) {
  const result = await chai.request(relayer.server)
    .post('/authorisation')
    .send({
      walletContractAddress: contract.address,
      key: wallet.address,
    });
  expect(result.status).to.eq(201);
}

async function getAuthorisation(relayer, contract, wallet) {
  const result = await chai.request(relayer.server)
    .get(`/authorisation/${contract.address}`)
    .send({
      key: wallet.address,
    });
  return {result, response: result.body.response};
}

describe('E2E: Relayer - Authorisation routes', async () => {
  let relayer;
  let provider;
  let wallet;
  let otherWallet;
  let contract;

  beforeEach(async () => {
    ({provider, wallet, otherWallet, relayer} = await startRelayer());
    contract = await createWalletContract(provider, relayer.server, wallet.address);
  });

  it('create and get authorisation', async () => {
    await postAuthorisationRequest(relayer, contract, wallet);
    const {result, response} = await getAuthorisation(relayer, contract, wallet);
    expect(result.status).to.eq(200);
    expect(response[0]).to.include({
      key: wallet.address.toLowerCase(),
      walletContractAddress: contract.address.toLowerCase(),
    });
    expect(response[0].deviceInfo).to.deep.include({
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

  it('deny request', async () => {
    await postAuthorisationRequest(relayer, contract, wallet);
    const result = await chai.request(relayer.server)
      .post(`/authorisation/${contract.address}`)
      .send({
        key: wallet.address,
      });
    expect(result.status).to.eq(204);
    const {result, response} = await getAuthorisation(relayer, contract, wallet);
    expect(response).to.deep.eq([]);
  });

  afterEach(async () => {
    await relayer.stop();
  });
});

import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {startRelayerWithRefund} from '../testhelpers/http';
import {createKeyPair, TEST_APPLICATION_INFO} from '@unilogin/commons';
import {signStringMessage, calculateGnosisStringHash} from '@unilogin/contracts';
import {deployGnosisSafeProxy} from '../testhelpers/createGnosisSafeContract';
import {utils} from 'ethers';

chai.use(chaiHttp);

const signRelayerRequest = (relayerRequest, privateKey) => {
  const msgHash = calculateGnosisStringHash(utils.arrayify(utils.toUtf8Bytes(relayerRequest.contractAddress)), relayerRequest.contractAddress);
  const relayerRequestSignature = signStringMessage(msgHash, privateKey);
  relayerRequest.signature = relayerRequestSignature;
};

async function postAuthorisationRequest(relayer, contract, keyPair) {
  const result = await chai.request(relayer.server)
    .post('/authorisation')
    .send({
      walletContractAddress: contract.address,
      key: keyPair.publicKey,
      applicationInfo: TEST_APPLICATION_INFO,
    });
  expect(result.status).to.eq(201);
}

async function getAuthorisation(relayer, contract, keyPair) {
  const msgHash = calculateGnosisStringHash(utils.arrayify(utils.toUtf8Bytes(contract.address)), contract.address);
  const relayerRequestSignature = signStringMessage(msgHash, keyPair.privateKey);
  const authorisationRequest = {
    contractAddress: contract.address,
    signature: relayerRequestSignature,
  };
  const {signature} = authorisationRequest;

  const result = await chai.request(relayer.server)
    .get(`/authorisation/${contract.address}?signature=${signature}`)
    .send({
      key: keyPair.publicKey,
    });
  return {result, response: result.body.response};
}

describe('E2E: Relayer - Authorisation routes', async () => {
  let relayer;
  let proxyContract;
  let keyPair;
  let walletContract;
  let factoryContract;
  let deployer;

  const relayerPort = '33511';

  beforeEach(async () => {
    ({relayer, deployer, walletContract, factoryContract} = await startRelayerWithRefund(relayerPort));
    ({proxyContract, keyPair} = await deployGnosisSafeProxy(deployer, factoryContract.address, walletContract.address));
  });

  it('get empty pending authorisations', async () => {
    const {result} = await getAuthorisation(relayer, proxyContract, keyPair);
    expect(result.status).to.eq(200);
    expect(result.body.response).to.deep.eq([]);
  });

  it('create and get authorisation', async () => {
    const newKeyPair = createKeyPair();
    await postAuthorisationRequest(relayer, proxyContract, newKeyPair);

    const {result, response} = await getAuthorisation(relayer, proxyContract, keyPair);
    expect(result.status).to.eq(200);
    expect(response[0]).to.include({
      key: newKeyPair.publicKey,
      walletContractAddress: proxyContract.address,
    });
    expect(response[0].deviceInfo).to.deep.include({
      city: 'unknown',
      ipAddress: '::ffff:127.0.0.1',
    });
  });

  it('deny request', async () => {
    const newKeyPair = createKeyPair();
    await postAuthorisationRequest(relayer, proxyContract, newKeyPair);

    const msgHash = calculateGnosisStringHash(utils.arrayify(utils.toUtf8Bytes(proxyContract.address)), proxyContract.address);
    const relayerRequestSignature = signStringMessage(msgHash, keyPair.privateKey);
    const authorisationRequest = {contractAddress: proxyContract.address, signature: relayerRequestSignature};

    const result = await chai.request(relayer.server)
      .post(`/authorisation/${proxyContract.address}`)
      .send({authorisationRequest});
    expect(result.status).to.eq(204);

    const {response} = await getAuthorisation(relayer, proxyContract, keyPair);
    expect(response).to.deep.eq([]);
  });

  describe('cancel request', () => {
    let newKeyPair;

    beforeEach(async () => {
      newKeyPair = createKeyPair();
      await postAuthorisationRequest(relayer, proxyContract, newKeyPair);
    });

    it('valid request', async () => {
      const authorisationRequest = {contractAddress: proxyContract.address};
      signRelayerRequest(authorisationRequest, newKeyPair.privateKey);

      const result = await chai.request(relayer.server)
        .delete(`/authorisation/${proxyContract.address}`)
        .send({authorisationRequest});
      expect(result.status).to.eq(204);

      const {response} = await getAuthorisation(relayer, proxyContract, keyPair);
      expect(response).to.deep.eq([]);
    });

    it('cancel non-existing request', async () => {
      const attackerKeyPair = createKeyPair();
      const authorisationRequest = {contractAddress: proxyContract.address};
      signRelayerRequest(authorisationRequest, attackerKeyPair.privateKey);

      const {status} = await chai.request(relayer.server)
        .delete(`/authorisation/${proxyContract.address}`)
        .send({authorisationRequest});
      expect(status).to.eq(404);

      const {response} = await getAuthorisation(relayer, proxyContract, keyPair);
      expect(response).to.have.lengthOf(1);
    });
  });

  it('Send valid cancel request', async () => {
    const authorisationRequest = {contractAddress: proxyContract.address};

    signRelayerRequest(authorisationRequest, keyPair.privateKey);
    const {body, status} = await chai.request(relayer.server)
      .post(`/authorisation/${proxyContract.address}`)
      .send({authorisationRequest});

    expect(status).to.eq(204);
    expect(body).to.deep.eq({});
  });

  it('Send forged cancel request', async () => {
    const attackerPrivateKey = createKeyPair().privateKey;
    const attackerAddress = utils.computeAddress(attackerPrivateKey);
    const authorisationRequest = {contractAddress: proxyContract.address};

    signRelayerRequest(authorisationRequest, attackerPrivateKey);
    const {body, status} = await chai.request(relayer.server)
      .post(`/authorisation/${proxyContract.address}`)
      .send({authorisationRequest});

    expect(status).to.eq(401);
    expect(body.type).to.eq('UnauthorisedAddress');
    expect(body.error).to.eq(`Error: Unauthorised address: ${attackerAddress}`);
  });

  it('Forged getPending request', async () => {
    const attackerPrivateKey = createKeyPair().privateKey;
    const authorisationRequest = {contractAddress: proxyContract.address};
    signRelayerRequest(authorisationRequest, attackerPrivateKey);

    const {body, status} = await chai.request(relayer.server)
      .get(`/authorisation/${proxyContract.address}?signature=${authorisationRequest.signature}`);

    expect(status).to.eq(401);
    expect(body.type).to.eq('UnauthorisedAddress');
  });

  afterEach(async () => {
    await relayer.stop();
  });
});

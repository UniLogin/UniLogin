import chai, {expect} from 'chai';
import {RelayerUnderTest} from '../../src';
import {startRelayer} from '../testhelpers/http';
import {StoredEncryptedWallet, TEST_ENCRYPTED_WALLET_JSON} from '@unilogin/commons';

describe('E2E: Relayer - restore wallet', () => {
  let relayer: RelayerUnderTest;
  const relayerPort = '33111';
  const relayerUrl = `http://localhost:${relayerPort}`;
  const email = 'name@gmail.com';
  const ensName = 'hello.mylogin.eth';
  const storedEncryptedWallet: StoredEncryptedWallet = {
    email,
    ensName,
    walletJSON: TEST_ENCRYPTED_WALLET_JSON,
  };

  beforeEach(async () => {
    ({relayer} = await startRelayer(relayerPort));
  });

  it('returns 201 if encrypted wallet is valid', async () => {
    const confirmationRequestResult = await chai.request(relayerUrl)
      .post('/email/request/creating')
      .send({email, ensName});
    expect(confirmationRequestResult.status).to.eq(201);

    const confirmationResult = await chai.request(relayerUrl)
      .post('/email/confirmation')
      .send({ensNameOrEmail: email, code: relayer.sentCodes[email]});
    expect(confirmationResult.status).to.eq(201);

    const result = await chai.request(relayerUrl)
      .post('/wallet/encrypted')
      .set({code: relayer.sentCodes[email]})
      .send(storedEncryptedWallet);
    expect(result.status).to.eq(201);

    const confirmationRequestResultForRestoring = await chai.request(relayerUrl)
      .post('/email/request/restoring')
      .send({ensNameOrEmail: ensName});
    expect(confirmationRequestResultForRestoring.status).to.eq(201);

    const restoreResult = await chai.request(relayerUrl)
      .get(`/wallet/restore/${email}`)
      .set({code: relayer.sentCodes[email]});
    expect(restoreResult.status).to.eq(200);
    expect(restoreResult.body.storedEncryptedWallet).to.deep.eq({email, ensName, walletJSON: TEST_ENCRYPTED_WALLET_JSON});
  });

  it('return 400 if confirmation code was not requested and previous code is used', async () => {
    const confirmationRequestResult = await chai.request(relayerUrl)
      .post('/email/request/creating')
      .send({email, ensName});
    expect(confirmationRequestResult.status).to.eq(201);

    const confirmationResult = await chai.request(relayerUrl)
      .post('/email/confirmation')
      .send({ensNameOrEmail: email, code: relayer.sentCodes[email]});
    expect(confirmationResult.status).to.eq(201);

    const result = await chai.request(relayerUrl)
      .post('/wallet/encrypted')
      .set({code: relayer.sentCodes[email]})
      .send(storedEncryptedWallet);
    expect(result.status).to.eq(201);

    const restoreResult = await chai.request(relayerUrl)
      .get(`/wallet/restore/${email}`)
      .set({code: relayer.sentCodes[email]});
    expect(restoreResult.status).to.eq(400);
    expect(restoreResult.body.error).to.eq(`Error: Unexpected confirmation from email: ${email}`);
  });

  afterEach(() => {
    relayer.stop();
  });
});

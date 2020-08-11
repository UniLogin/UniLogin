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

  before(async () => {
    ({relayer} = await startRelayer(relayerPort));
  });

  it('returns 201 if encrypted wallet is valid', async () => {
    const confirmationRequestResult = await chai.request(relayerUrl)
      .post('/email/request')
      .send({email, ensName});
    expect(confirmationRequestResult.status).to.eq(201);

    const confirmationResult = await chai.request(relayerUrl)
      .post('/email/confirmation')
      .send({email, code: relayer.sentCodes[email]});
    expect(confirmationResult.status).to.eq(201);

    const result = await chai.request(relayerUrl)
      .post('/wallet/encrypted')
      .set({code: relayer.sentCodes[email]})
      .send(storedEncryptedWallet);
    expect(result.status).to.eq(201);

    const confirmationRequestResult2 = await chai.request(relayerUrl)
      .post('/email/request')
      .send({email, ensName});
    expect(confirmationRequestResult2.status).to.eq(201);

    const restoreResult = await chai.request(relayerUrl)
      .get(`/wallet/restore/${email}`)
      .set({code: relayer.sentCodes[email]});
    expect(restoreResult.status).to.eq(200);
    expect(restoreResult.body.storedEncryptedWallet).to.deep.eq({email, ensName, walletJSON: TEST_ENCRYPTED_WALLET_JSON});
  });

  after(() => {
    relayer.stop();
  });
});

import chai, {expect} from 'chai';
import {StoredEncryptedWallet, TEST_CONTRACT_ADDRESS, TEST_WALLET} from '@unilogin/commons';
import {RelayerUnderTest} from '../../src';
import {startRelayer} from '../testhelpers/http';
import {createTestEmailConfirmation} from '../testhelpers/createTestEmailConfirmation';
import {EmailConfirmationsStore} from '../../src/integration/sql/services/EmailConfirmationsStore';

describe('E2E: Relayer - encrypted wallet', () => {
  let relayer: RelayerUnderTest;
  const relayerPort = '33111';
  const relayerUrl = `http://localhost:${relayerPort}`;
  let emailConfirmationsStore: EmailConfirmationsStore;
  const email = 'test@email.com';
  let code: string;
  const storedEncryptedWallet: StoredEncryptedWallet = {
    email,
    ensName: 'test@unilogin.io',
    walletJSON: TEST_WALLET.encryptedWallet,
    contractAddress: TEST_CONTRACT_ADDRESS,
    publicKey: TEST_WALLET.address,
  };

  before(async () => {
    ({relayer} = await startRelayer(relayerPort));
    emailConfirmationsStore = new EmailConfirmationsStore(relayer.database);
    const emailConfirmation = createTestEmailConfirmation({email});
    await emailConfirmationsStore.add({...emailConfirmation, isConfirmed: true});
    code = emailConfirmation.code;
  });

  it('valid encrypted wallet', async () => {
    const result = await chai.request(relayerUrl)
      .post('/wallet/encrypted')
      .set({code})
      .send(storedEncryptedWallet);
    expect(result.status).to.eq(201);
    expect(result.body).to.deep.eq({email: storedEncryptedWallet.email});

    const duplicatedEmailRequestResult = await chai.request(relayerUrl)
      .post('/email/request/creating')
      .send({email, ensName: 'test.unilogin.io'});
    expect(duplicatedEmailRequestResult.body).to.deep.eq({
      error: 'Error: test@email.com or test.unilogin.io already used',
      type: 'AlreadyUsed',
    });
  });

  it('returns 404 if encrypted wallet email is not confirmed', async () => {
    const result = await chai.request(relayerUrl)
      .post('/wallet/encrypted')
      .set({code})
      .send({...storedEncryptedWallet, email: 'wrong@email.com'});
    expect(result.status).to.eq(404);
  });

  it('returns 400, when missing header', async () => {
    const result = await chai.request(relayerUrl)
      .post('/wallet/encrypted')
      .send(storedEncryptedWallet);
    expect(result.status).to.eq(400);
  });

  it('returns 400, when missing body', async () => {
    const result = await chai.request(relayerUrl)
      .post('/wallet/encrypted')
      .set({code});
    expect(result.status).to.eq(400);
  });

  after(() => {
    relayer.stop();
  });
});

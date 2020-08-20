import chai, {expect} from 'chai';
import {RelayerUnderTest} from '../../src';
import {startRelayer} from '../testhelpers/http';

describe('E2E: Relayer - Email Confirmation', () => {
  let relayer: RelayerUnderTest;
  const relayerPort = '33111';
  const relayerUrl = `http://localhost:${relayerPort}`;

  before(async () => {
    ({relayer} = await startRelayer(relayerPort));
  });

  describe('missing parameter', () => {
    it('/request', async () => {
      const result = await chai.request(relayerUrl)
        .post('/email/request/creating');
      expect(result.status).to.eq(400);
    });

    it('/confirmation', async () => {
      const result = await chai.request(relayerUrl)
        .post('/email/confirmation');
      expect(result.status).to.eq(400);
    });
  });

  it('roundtrip', async () => {
    const email = 'account@unilogin.test';

    const notExpectedConfirmationResult = await chai.request(relayerUrl)
      .post('/email/confirmation')
      .send({ensNameOrEmail: email, code: '123456'});
    expect(notExpectedConfirmationResult.status).to.eq(404);
    expect(notExpectedConfirmationResult.body).to.deep.eq({
      error: `Error: Email confirmation not found for email: ${email}`,
      type: 'EmailConfirmationNotFound',
    });

    const confirmationRequestResult = await chai.request(relayerUrl)
      .post('/email/request/creating')
      .send({email, ensName: 'hello.unilogin.eth'});
    expect(confirmationRequestResult.status).to.eq(201);
    expect(confirmationRequestResult.body).to.deep.eq({email});

    const invalidCode = '123456';
    const confirmationResultWrongCode = await chai.request(relayerUrl)
      .post('/email/confirmation')
      .send({ensNameOrEmail: email, code: invalidCode});
    expect(confirmationResultWrongCode.status).to.eq(400);
    expect(confirmationResultWrongCode.body).to.deep.eq({
      error: `Error: Invalid code: ${invalidCode}`,
      type: 'InvalidCode',
    });

    const confirmationResult = await chai.request(relayerUrl)
      .post('/email/confirmation')
      .send({ensNameOrEmail: email, code: relayer.sentCodes[email]});
    expect(confirmationResult.status).to.eq(201);

    const duplicatedConfirmationRequestResult = await chai.request(relayerUrl)
      .post('/email/request/creating')
      .send({email, ensName});
    expect(duplicatedConfirmationRequestResult.status).to.eq(201, duplicatedConfirmationRequestResult.body.error);
  });

  const email = 'name@unilogin.test';
  const ensName = 'name.mylogin.eth';

  for (const ensNameOrEmail of [email, ensName]) {
    it(`email confirmation works for ${ensNameOrEmail}`, async () => {
      const confirmationRequestResult = await chai.request(relayerUrl)
        .post('/email/request/creating')
        .send({email, ensName});
      expect(confirmationRequestResult.status).to.eq(201);

      const confirmationResult = await chai.request(relayerUrl)
        .post('/email/confirmation')
        .send({ensNameOrEmail, code: relayer.sentCodes[email]});
      expect(confirmationResult.status).to.eq(201);
      expect(confirmationResult.body).to.deep.eq({ensNameOrEmail});

      const duplicatedConfirmationRequestResult = await chai.request(relayerUrl)
        .post('/email/request/creating')
        .send({email, ensName});
      expect(duplicatedConfirmationRequestResult.status).to.eq(201, duplicatedConfirmationRequestResult.body.error);
    });
  }

  it('returns 404 if email/ensName not found', async () => {
    const confirmationRequestResultForRestoring = await chai.request(relayerUrl)
      .post('/email/request/restoring')
      .send({ensNameOrEmail: 'notexisting.mylogin.eth'});
    expect(confirmationRequestResultForRestoring.status).to.eq(404);
  });

  afterEach(async () => {
    await relayer.clearDatabase();
  });

  after(() => {
    relayer.stop();
  });
});

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
        .post('/email/request');
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
      .send({email, code: '123456'});
    expect(notExpectedConfirmationResult.status).to.eq(404);
    expect(notExpectedConfirmationResult.body).to.deep.eq({
      error: `Error: Email confirmation not found for email: ${email}`,
      type: 'EmailConfirmationNotFound',
    });

    const confirmationRequestResult = await chai.request(relayerUrl)
      .post('/email/request')
      .send({email, ensName: 'hello.unilogin.eth'});
    expect(confirmationRequestResult.status).to.eq(201);
    expect(confirmationRequestResult.body).to.deep.eq({email});

    const invalidCode = '123456';
    const confirmationResult = await chai.request(relayerUrl)
      .post('/email/confirmation')
      .send({email, code: invalidCode});
    expect(confirmationResult.status).to.eq(400);
    expect(confirmationResult.body).to.deep.eq({
      error: `Error: Invalid code: ${invalidCode}`,
      type: 'InvalidCode',
    });
  });

  after(() => {
    relayer.stop();
  });
});

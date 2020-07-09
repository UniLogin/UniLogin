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

  it('returns 400, when missing parameter', async () => {
    const result = await chai.request(relayerUrl)
      .post('/email/request');
    expect(result.status).to.eq(400);
  });

  it('returns 201 if valid future wallet', async () => {
    const email = 'account@unilogin.test';
    const result = await chai.request(relayerUrl)
      .post('/email/request')
      .send({email, ensName: 'hello.unilogin.eth'});
    expect(result.status).to.eq(201);
    expect(result.body).to.deep.eq({response: email});
  });

  after(() => {
    relayer.stop();
  });
});

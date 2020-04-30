import chai, {expect} from 'chai';
import {RelayerUnderTest} from '../../src';
import {startRelayerWithRefund} from '../testhelpers/http';
import {TEST_CONTRACT_ADDRESS, TEST_KEY, ETHER_NATIVE_TOKEN} from '@unilogin/commons';

describe('E2E: Relayer - future wallet', () => {
  let relayer: RelayerUnderTest;
  const relayerPort = '33111';
  const relayerUrl = `http://localhost:${relayerPort}`;

  before(async () => {
    ({relayer} = await startRelayerWithRefund(relayerPort));
  });

  it('returns 400, when missing parameter', async () => {
    const result = await chai.request(relayerUrl)
      .post('/wallet/future');
    expect(result.status).to.eq(400);
  });

  it('returns 201 if valid future wallet', async () => {
    const serializedFutureWallet = {
      contractAddress: TEST_CONTRACT_ADDRESS,
      publicKey: TEST_KEY,
      ensName: 'name.mylogin.eth',
      gasToken: ETHER_NATIVE_TOKEN.address,
      gasPrice: '1',
    };
    const result = await chai.request(relayerUrl)
      .post('/wallet/future')
      .send(serializedFutureWallet);
    expect(result.status).to.eq(201);
    expect(result.body).to.deep.eq({contractAddress: serializedFutureWallet.contractAddress});
  });

  after(() => {
    relayer.stop();
  });
});

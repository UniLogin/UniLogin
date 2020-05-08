import chai, {expect} from 'chai';
import {TEST_CONTRACT_ADDRESS, TEST_KEY, ETHER_NATIVE_TOKEN, TEST_GAS_PRICE} from '@unilogin/commons';
import {RelayerUnderTest} from '../../src';
import {startRelayer} from '../testhelpers/http';

describe('E2E: Relayer - future wallet', () => {
  let relayer: RelayerUnderTest;
  const relayerPort = '33111';
  const relayerUrl = `http://localhost:${relayerPort}`;

  before(async () => {
    ({relayer} = await startRelayer(relayerPort));
  });

  it('returns 400, when missing parameter', async () => {
    const result = await chai.request(relayerUrl)
      .post('/wallet/future');
    expect(result.status).to.eq(400);
  });

  it('returns 201 if valid future wallet', async () => {
    const storedFutureWallet = {
      contractAddress: TEST_CONTRACT_ADDRESS,
      publicKey: TEST_KEY,
      ensName: 'name.mylogin.eth',
      gasToken: ETHER_NATIVE_TOKEN.address,
      gasPrice: TEST_GAS_PRICE,
    };
    const result = await chai.request(relayerUrl)
      .post('/wallet/future')
      .send(storedFutureWallet);
    expect(result.status).to.eq(201);
    expect(result.body).to.deep.eq({contractAddress: storedFutureWallet.contractAddress});
  });

  after(() => {
    relayer.stop();
  });
});

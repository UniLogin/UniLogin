import {expect} from 'chai';
import sinon from 'sinon';
import {Provider} from 'ethers/providers';
import {createMockProvider} from 'ethereum-waffle';
import {utils} from 'ethers';
import {Message, TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, SignedMessage, TEST_PRIVATE_KEY} from '@universal-login/commons';
import UniversalLoginSDK from '../../../lib/api/sdk';
import {transferMessage} from '../../fixtures/basicSDK';

describe('UNIT: sdk.execute transform message', () => {
  let sdk: UniversalLoginSDK;
  let provider: Provider;
  const callback = sinon.spy();

  beforeEach(() => {
    provider = createMockProvider();
    sdk = new UniversalLoginSDK('', provider, {});
    sdk.executionFactory.createExecution = callback;
    sdk.getNonce = (address: string) => Promise.resolve(0);
  });

  it('correct transform', async () => {
    const incomingMessage: Partial<Message> = {
      ...transferMessage,
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      gasToken: TEST_ACCOUNT_ADDRESS,
      data: '0xbeef',
      gasLimit: utils.bigNumberify(100000)
    };

    const signedMessage: Partial<SignedMessage> = {
      ...incomingMessage,
      gasData: 136,
      gasLimitExecution: utils.bigNumberify(100000 - 136),
      nonce: 0,
      signature: '0x2bca7b700a408c95bd10c3f8f833ccb7c6789f377d79d9470ce023723d0bd2e55b75ae368ee25e01dadf5cb98f229a9b06bc1cc86dbbc44f7756b659fbcaa0471b'
    };
    await sdk.execute(incomingMessage, TEST_PRIVATE_KEY);
    expect(callback.args[0][0]).to.deep.equal(signedMessage);
  });
});

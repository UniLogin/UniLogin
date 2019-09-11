import {expect} from 'chai';
import sinon from 'sinon';
import {Provider} from 'ethers/providers';
import {createMockProvider} from 'ethereum-waffle';
import {utils} from 'ethers';
import {Message, TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, SignedMessage, TEST_PRIVATE_KEY, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import UniversalLoginSDK from '../../../lib/api/sdk';
import {transferMessage} from '../../fixtures/basicSDK';
import {SdkConfigDefault} from '../../../lib/config/SdkConfigDefault';

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
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: SdkConfigDefault.paymentOptions.gasPrice,
      gasToken: SdkConfigDefault.paymentOptions.gasToken,
      data: '0xbeef',
      gasLimit: utils.bigNumberify(100000)
    };

    const signedMessage: Partial<SignedMessage> = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: SdkConfigDefault.paymentOptions.gasPrice,
      gasToken: SdkConfigDefault.paymentOptions.gasToken,
      data: '0xbeef',
      gasData: 136,
      gasLimitExecution: utils.bigNumberify(100000 - 136),
      nonce: 0,
      signature: '0x1d25bc145fa3d2b6b98e9da7f1c0752f37f0ef9f388ceedca12f21cb8ff3c0106516a6b93ab996e51acbec7f9a6a0a0c59dc27525329e08b8e5eae0214ea11061c'
    };

    await sdk.execute(incomingMessage, TEST_PRIVATE_KEY);
    expect(callback.args[0][0]).to.deep.equal(signedMessage);
  });
});

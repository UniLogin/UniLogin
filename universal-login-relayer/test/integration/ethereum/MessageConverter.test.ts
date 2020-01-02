import {expect} from 'chai';
import {utils, Contract} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {TEST_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN, SignedMessage, createFullHexString, OperationType, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from '@universal-login/contracts';
import {setupWalletContract} from '@universal-login/contracts/testutils';
import {MessageConverter} from '../../../src/integration/ethereum/MessageConverter';
import {GAS_LIMIT_MARGIN} from '../../../src/core/utils/messages/serialisation';

describe('MessageConverter', () => {
  let messageConverter: MessageConverter;
  let proxyWallet: Contract;

  before(async () => {
    const provider = createMockProvider();
    messageConverter = new MessageConverter();
    const [wallet] = getWallets(provider);
    ({proxyWallet} = await setupWalletContract(wallet));
  });

  it('Converts message to signed message', async () => {
    const message: SignedMessage = {
      from: proxyWallet.address,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      nonce: 0,
      baseGas: utils.bigNumberify(58976),
      safeTxGas: utils.bigNumberify(41024),
      signature: createFullHexString(64),
      operationType: OperationType.call,
      refundReceiver: TEST_ACCOUNT_ADDRESS,
    };
    const actualTransaction = await messageConverter.messageToTransaction(message);
    const expectedTransaction = {
      gasPrice: DEFAULT_GAS_PRICE,
      gasLimit: (message.safeTxGas as utils.BigNumber).add(message.baseGas).add(GAS_LIMIT_MARGIN),
      to: proxyWallet.address,
      value: 0,
      data: encodeDataForExecuteSigned(message),
    };
    expect(actualTransaction).to.deep.include(expectedTransaction);
  });
});

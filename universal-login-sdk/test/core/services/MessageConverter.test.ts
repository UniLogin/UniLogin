import {expect} from 'chai';
import {utils, Contract} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {TEST_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN, KeyPair} from '@universal-login/commons';
import {BlockchainService} from '@universal-login/contracts';
import {setupWalletContract} from '@universal-login/contracts/testutils';
import {MessageConverter} from '../../../src/core/services/MessageConverter';

describe('MessageConverter', () => {
  let messageConverter: MessageConverter;
  let proxyWallet: Contract;
  let keyPair: KeyPair;

  before(async () => {
    const provider = createMockProvider();
    const blockchainService = new BlockchainService(provider);

    messageConverter = new MessageConverter(blockchainService);

    const [wallet] = getWallets(provider);
    ({proxyWallet, keyPair} = await setupWalletContract(wallet));
  });

  it('Converts message to signed message', async () => {
    const message = {
      from: proxyWallet.address,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      gasLimit: utils.bigNumberify(100000),
      nonce: 0,
    };
    const actualMessage = await messageConverter.messageToSignedMessage(message, keyPair.privateKey);
    const expectedMessage = {
      baseGas: utils.bigNumberify(58976),
      safeTxGas: utils.bigNumberify(41024),
    };
    expect(actualMessage).to.deep.include(expectedMessage);
  });
});

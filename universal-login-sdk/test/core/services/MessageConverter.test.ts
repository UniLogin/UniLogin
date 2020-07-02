import {expect} from 'chai';
import {utils, Contract} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import {TEST_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN, KeyPair, ProviderService} from '@unilogin/commons';
import {ContractService} from '@unilogin/contracts';
import {setupWalletContract} from '@unilogin/contracts/testutils';
import {MessageConverter} from '../../../src/core/services/MessageConverter';

describe('MessageConverter', () => {
  let messageConverter: MessageConverter;
  let proxyWallet: Contract;
  let keyPair: KeyPair;

  before(async () => {
    const provider = new MockProvider();
    const providerService = new ProviderService(provider);
    const contractService = new ContractService(providerService);
    messageConverter = new MessageConverter(contractService, providerService);
    const [wallet] = provider.getWallets();
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

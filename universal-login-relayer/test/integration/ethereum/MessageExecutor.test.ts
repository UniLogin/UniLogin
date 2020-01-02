import {SignedMessage, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {emptyMessage} from '@universal-login/contracts/testutils';
import {expect} from 'chai';
import {loadFixture} from 'ethereum-waffle';
import {Contract, providers, Wallet} from 'ethers';
import {bigNumberify} from 'ethers/utils';
import MessageExecutor from '../../../src/integration/ethereum/MessageExecutor';
import {getTestSignedMessage} from '../../testconfig/message';
import basicWalletContractWithMockToken from '../../fixtures/basicWalletContractWithMockToken';
import MessageMemoryRepository from '../../mock/MessageMemoryRepository';
import {MessageConverter} from '../../../src/integration/ethereum/MessageConverter';

describe('INT: MessageExecutor', async () => {
  let messageExecutor: MessageExecutor;
  let signedMessage: SignedMessage;
  let provider: providers.Provider;
  let wallet: Wallet;
  let walletContract: Contract;
  const validator = {
    validate: async () => {},
  };

  before(async () => {
    ({wallet, walletContract, provider} = await loadFixture(basicWalletContractWithMockToken));
    messageExecutor = new MessageExecutor(wallet, validator as any, new MessageMemoryRepository(), {handle: async () => {}} as any, new MessageConverter());
    const message = {...emptyMessage, from: walletContract.address, to: TEST_ACCOUNT_ADDRESS, value: bigNumberify(2), nonce: await walletContract.lastNonce()};
    signedMessage = getTestSignedMessage(message, wallet.privateKey);
  });

  it('should execute transaction and wait for it', async () => {
    const expectedBalance = (await provider.getBalance(signedMessage.to)).add(signedMessage.value);
    const transactionResponse = await messageExecutor.execute(signedMessage);
    await transactionResponse.wait();
    const balance = await provider.getBalance(signedMessage.to);
    expect(balance).to.be.eq(expectedBalance);
  });
});

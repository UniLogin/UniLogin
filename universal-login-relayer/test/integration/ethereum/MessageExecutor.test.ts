import {SignedMessage, TEST_ACCOUNT_ADDRESS, Message, TEST_TOKEN_PRICE_IN_ETH, TEST_GAS_PRICE_IN_TOKEN, TEST_GAS_PRICE} from '@unilogin/commons';
import {emptyMessage} from '@unilogin/contracts/testutils';
import {expect} from 'chai';
import {loadFixture} from 'ethereum-waffle';
import {Contract, providers, Wallet, utils} from 'ethers';
import {bigNumberify} from 'ethers/utils';
import MessageExecutor from '../../../src/integration/ethereum/MessageExecutor';
import {getTestSignedMessage} from '../../testconfig/message';
import {basicWalletContractWithMockToken} from '../../fixtures/basicWalletContractWithMockToken';
import MessageMemoryRepository from '../../mock/MessageMemoryRepository';
import {setupWalletContractService} from '../../testhelpers/setupWalletContractService';
import {GasTokenValidator} from '../../../src/core/services/validators/GasTokenValidator';
import {gasPriceOracleMock} from '@unilogin/commons/testutils';

describe('INT: MessageExecutor', () => {
  let messageExecutor: MessageExecutor;
  let signedMessage: SignedMessage;
  let provider: providers.Provider;
  let wallet: Wallet;
  let walletContract: Contract;
  let message: Message;
  const validator = {
    validate: () => {},
  };
  const gasTokenValidator = new GasTokenValidator(gasPriceOracleMock as any);

  beforeEach(async () => {
    ({wallet, walletContract, provider} = await loadFixture(basicWalletContractWithMockToken));
    messageExecutor = new MessageExecutor(wallet, validator as any, new MessageMemoryRepository(), {handle: async () => {}} as any, setupWalletContractService(wallet.provider), gasTokenValidator);
    message = {...emptyMessage, gasPrice: TEST_GAS_PRICE, from: walletContract.address, to: TEST_ACCOUNT_ADDRESS, value: bigNumberify(2), nonce: await walletContract.lastNonce()};
    signedMessage = getTestSignedMessage(message, wallet.privateKey);
  });

  it('should execute transaction and wait for it', async () => {
    const expectedBalance = (await provider.getBalance(signedMessage.to)).add(signedMessage.value);
    const transactionResponse = await messageExecutor.execute(signedMessage);
    await transactionResponse.wait();
    const balance = await provider.getBalance(signedMessage.to);
    expect(balance).to.eq(expectedBalance);
  });

  it('should execute transaction for token and wait for it', async () => {
    signedMessage = getTestSignedMessage({...message, gasPrice: TEST_GAS_PRICE_IN_TOKEN}, wallet.privateKey);
    const expectedBalance = (await provider.getBalance(signedMessage.to)).add(signedMessage.value);
    const transactionResponse = await messageExecutor.execute(signedMessage, TEST_TOKEN_PRICE_IN_ETH);
    await transactionResponse.wait();
    const balance = await provider.getBalance(signedMessage.to);
    expect(balance).to.eq(expectedBalance);
  });

  it('should throw error when gasPrice changed significantly', async () => {
    signedMessage = getTestSignedMessage({...message, gasPrice: utils.parseUnits('2', 'gwei').toString()}, wallet.privateKey);
    await expect(messageExecutor.execute(signedMessage)).to.be.rejectedWith('Gas price is not enough');
  });
});

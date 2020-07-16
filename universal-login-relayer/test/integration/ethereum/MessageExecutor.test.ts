import {SignedMessage, TEST_ACCOUNT_ADDRESS, Message, TEST_TOKEN_PRICE_IN_ETH, TEST_GAS_PRICE_IN_TOKEN, TEST_GAS_PRICE} from '@unilogin/commons';
import {getMockedGasPriceOracle} from '@unilogin/commons/testutils';
import {emptyMessage} from '@unilogin/contracts/testutils';
import {expect} from 'chai';
import {loadFixture, MockProvider} from 'ethereum-waffle';
import {Contract, Wallet, utils} from 'ethers';
import {bigNumberify} from 'ethers/utils';
import MessageExecutor from '../../../src/integration/ethereum/MessageExecutor';
import {getTestSignedMessage} from '../../testconfig/message';
import {basicWalletContractWithMockToken} from '../../fixtures/basicWalletContractWithMockToken';
import MessageMemoryRepository from '../../mock/MessageMemoryRepository';
import {setupWalletContractService} from '../../testhelpers/setupWalletContractService';
import {GasTokenValidator} from '../../../src/core/services/validators/GasTokenValidator';
import EstimateGasValidator from '../../../src/integration/ethereum/validators/EstimateGasValidator';

describe('INT: MessageExecutor', () => {
  let messageExecutor: MessageExecutor;
  let signedMessage: SignedMessage;
  let provider: MockProvider;
  let wallet: Wallet;
  let walletContract: Contract;
  let mockToken: Contract;
  let message: Message;
  const validator = {
    validate: async () => Promise.resolve(),
  };
  const gasTokenValidator = new GasTokenValidator(getMockedGasPriceOracle() as any);

  beforeEach(async () => {
    ({wallet, walletContract, mockToken, provider} = await loadFixture(basicWalletContractWithMockToken));
    const walletContractService = setupWalletContractService(provider);
    const estimateGasValidator = new EstimateGasValidator(wallet, walletContractService);
    messageExecutor = new MessageExecutor(wallet, validator as any, new MessageMemoryRepository(), {handle: async () => {}} as any, walletContractService, gasTokenValidator, estimateGasValidator);
    message = {...emptyMessage, gasPrice: TEST_GAS_PRICE, from: walletContract.address, to: TEST_ACCOUNT_ADDRESS, value: bigNumberify(2), nonce: await walletContract.lastNonce()};
    signedMessage = getTestSignedMessage(message, wallet.privateKey);
  });

  it('should execute transaction and wait for it', async () => {
    const expectedBalance = (await provider.getBalance(signedMessage.to)).add(signedMessage.value);
    const messageItem = {message: signedMessage, tokenPriceInEth: '1'} as any;
    const transactionResponse = await messageExecutor.execute(messageItem);
    await transactionResponse.wait();
    const balance = await provider.getBalance(signedMessage.to);
    expect(balance).to.eq(expectedBalance);
  });

  it('should execute transaction for token and wait for it', async () => {
    signedMessage = getTestSignedMessage({...message, gasToken: mockToken.address, gasPrice: TEST_GAS_PRICE_IN_TOKEN}, wallet.privateKey);
    const expectedBalance = (await provider.getBalance(signedMessage.to)).add(signedMessage.value);
    const minimumRefundInToken = (utils.bigNumberify(signedMessage.baseGas)).mul(signedMessage.gasPrice);
    const maximumRefundInToken = (utils.bigNumberify(signedMessage.baseGas).add(signedMessage.safeTxGas)).mul(signedMessage.gasPrice);
    const tokenBalanceBeforeRefund = await mockToken.balanceOf(signedMessage.from);
    const transactionResponse = await messageExecutor.execute({message: signedMessage, tokenPriceInEth: TEST_TOKEN_PRICE_IN_ETH} as any);
    await transactionResponse.wait();
    const balance = await provider.getBalance(signedMessage.to);
    expect(balance).to.eq(expectedBalance);
    const payerBalance = await mockToken.balanceOf(signedMessage.from);
    expect(payerBalance).to.be.above(tokenBalanceBeforeRefund.sub(maximumRefundInToken));
    expect(payerBalance).to.be.below(tokenBalanceBeforeRefund.sub(minimumRefundInToken));
  });

  it('should throw error when gasPrice changed significantly', async () => {
    signedMessage = getTestSignedMessage({...message, gasPrice: utils.parseUnits('2', 'gwei').toString()}, wallet.privateKey);
    await expect(messageExecutor.execute({message: signedMessage, tokenPriceInEth: '1'} as any)).to.be.rejectedWith('Gas price is not enough');
  });
});

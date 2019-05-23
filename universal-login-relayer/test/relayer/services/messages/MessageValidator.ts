import {expect} from 'chai';
import {Contract, Wallet, utils, providers} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {createSignedMessage, MessageWithFrom, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import basicWalletContractWithMockToken from '../../../fixtures/basicWalletContractWithMockToken';
import MessageValidator from '../../../../lib/services/messages/MessageValidator';
import { messageToTransaction } from '../../../../lib/utils/utils';

describe('MessageValidator', async () => {
  let message: MessageWithFrom;
  let mockToken: Contract;
  let walletContract: Contract;
  let wallet: Wallet;
  let messageValidator: MessageValidator;

  before(async () => {
    ({mockToken, wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    message = {from: walletContract.address, gasToken: mockToken.address, to: TEST_ACCOUNT_ADDRESS};
    messageValidator = new MessageValidator(wallet);
  });

  it('throw error when not enough gas', async () => {
    const signedMessage = await createSignedMessage({...message, gasLimit: 100}, wallet.privateKey);
    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    await expect(messageValidator.validate(signedMessage, transactionReq)).to.be.eventually.rejectedWith('Not enough gas');
  });

  it('Error when not enough tokens', async () => {
    const signedMessage = await createSignedMessage({...message, gasLimit: utils.parseEther('2.0')}, wallet.privateKey);
    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    await expect(messageValidator.validate(signedMessage, transactionReq))
      .to.be.eventually.rejectedWith('Not enough tokens');
  });
});

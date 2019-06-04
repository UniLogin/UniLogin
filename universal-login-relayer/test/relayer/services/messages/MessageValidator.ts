import {expect} from 'chai';
import {Contract, Wallet, utils, providers} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {createSignedMessage, MessageWithFrom, TEST_ACCOUNT_ADDRESS, ContractWhiteList} from '@universal-login/commons';
import basicWalletContractWithMockToken from '../../../fixtures/basicWalletContractWithMockToken';
import MessageValidator from '../../../../lib/services/messages/MessageValidator';
import {messageToTransaction} from '../../../../lib/utils/utils';
import {getContractWhiteList} from '../../../../lib/utils/relayerUnderTest';

describe('MessageValidator', async () => {
  let message: MessageWithFrom;
  let mockToken: Contract;
  let walletContract: Contract;
  let wallet: Wallet;
  let messageValidator: MessageValidator;
  const contractWhiteList: ContractWhiteList = getContractWhiteList();

  before(async () => {
    ({mockToken, wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    message = {from: walletContract.address, gasToken: mockToken.address, to: TEST_ACCOUNT_ADDRESS};
    messageValidator = new MessageValidator(wallet, contractWhiteList);
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

  it('throw error when not correct proxy', async () => {
    messageValidator = new MessageValidator(wallet, {
      master: [],
      proxy: ['0x1234']
    });
    const signedMessage = await createSignedMessage({...message}, wallet.privateKey);
    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    await expect(messageValidator.validate(signedMessage, transactionReq)).to.be.eventually.rejectedWith(`Invalid proxy at address '${signedMessage.from}'. Deployed contract bytecode hash: '${contractWhiteList.proxy[0]}'. Supported bytecode hashes: 0x1234`);
  });
});

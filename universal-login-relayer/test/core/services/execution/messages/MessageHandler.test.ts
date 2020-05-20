import {GAS_BASE, GAS_FIXED, Message, TEST_TOKEN_PRICE_IN_ETH, TEST_TOKEN_ADDRESS, TEST_GAS_PRICE_CHEAP, TEST_GAS_PRICE_IN_TOKEN} from '@unilogin/commons';
import {waitExpect} from '@unilogin/commons/testutils';
import {beta2} from '@unilogin/contracts';
import {encodeFunction} from '@unilogin/contracts/testutils';
import {expect} from 'chai';
import {utils, Wallet, Contract} from 'ethers';
import {clearDatabase} from '../../../../../src/http/relayers/RelayerUnderTest';
import defaultDeviceInfo from '../../../../testconfig/defaults';
import {getTestSignedMessage} from '../../../../testconfig/message';
import {addKeyMessage, removeKeyMessage, transferMessage} from '../../../../fixtures/basicWalletContract';
import {getKnexConfig} from '../../../../testhelpers/knex';
import setupMessageService from '../../../../testhelpers/setupMessageService';
import MessageHandler from '../../../../../src/core/services/execution/messages/MessageHandler';
import {Provider} from 'ethers/providers';
import AuthorisationStore from '../../../../../src/integration/sql/services/AuthorisationStore';
import {DevicesStore} from '../../../../../src/integration/sql/services/DevicesStore';
import ExecutionWorker from '../../../../../src/core/services/execution/ExecutionWorker';
import IMessageRepository from '../../../../../src/core/models/messages/IMessagesRepository';

describe('INT: MessageHandler', () => {
  let messageHandler: MessageHandler;
  let provider: Provider;
  let authorisationStore: AuthorisationStore;
  let messageRepository: IMessageRepository;
  let devicesStore: DevicesStore;
  let wallet: Wallet;
  let walletContract: Contract;
  let msg: Message;
  let otherWallet: Wallet;
  let executionWorker: ExecutionWorker;
  let mockToken: Contract;
  let mockTokenNotOwned: Contract;
  const knex = getKnexConfig();

  beforeEach(async () => {
    ({authorisationStore, devicesStore, executionWorker, messageHandler, messageRepository, mockToken, mockTokenNotOwned, provider, wallet, walletContract, otherWallet} = await setupMessageService(knex));
    msg = {...transferMessage, from: walletContract.address, nonce: await walletContract.lastNonce(), refundReceiver: wallet.address};
    executionWorker.start();
  });

  afterEach(async () => {
    await executionWorker.stopLater();
    await clearDatabase(knex);
  });

  it('Error when not enough tokens', async () => {
    const signedMessage = getTestSignedMessage({...msg, gasPrice: TEST_GAS_PRICE_IN_TOKEN, gasToken: mockTokenNotOwned.address}, wallet.privateKey);
    const {messageHash} = await messageHandler.handle(signedMessage);
    await executionWorker.stopLater();
    const messageEntry = await messageHandler.getStatus(messageHash);
    expect(messageEntry?.error).to.eq('Error: Not enough tokens');
  });

  it('Error when token not supported', async () => {
    const signedMessage = getTestSignedMessage({...msg, gasToken: TEST_TOKEN_ADDRESS}, wallet.privateKey);
    await expect(messageHandler.handle(signedMessage)).to.be.rejectedWith(`Token: ${TEST_TOKEN_ADDRESS} is not supported.`);
  });

  it('Error when not enough gas', async () => {
    const safeTxGas = 1;
    const baseGas = 7696;
    const gasLimit = utils.bigNumberify(baseGas + safeTxGas).add(GAS_FIXED);
    const signedMessage = getTestSignedMessage({...msg, gasLimit}, wallet.privateKey);
    await expect(messageHandler.handle(signedMessage)).to.be.rejectedWith(`Insufficient Gas. Got safeTxGas 1 but should greater than ${GAS_BASE}`);
  });

  it('Error when gasPrice below tolerance', async () => {
    const gasPrice = TEST_GAS_PRICE_CHEAP.div(2);
    const signedMessage = getTestSignedMessage({...msg, gasPrice}, wallet.privateKey);
    await expect(messageHandler.handle(signedMessage)).to.be.rejectedWith('Gas price is not enough');
  });

  describe('Transfer', () => {
    it('successful execution of transfer', async () => {
      const expectedBalance = (await provider.getBalance(msg.to)).add(msg.value);
      const signedMessage = getTestSignedMessage(msg, wallet.privateKey);
      const {messageHash} = await messageHandler.handle(signedMessage);
      expect(await messageHandler.isPresent(messageHash)).to.be.true;
      const messageItem = await messageRepository.get(messageHash);
      expect(messageItem.tokenPriceInEth).be.eq('1');
      await executionWorker.stopLater();
      expect(await provider.getBalance(msg.to)).to.eq(expectedBalance);
      const msgStatus = await messageHandler.getStatus(messageHash);
      expect(msgStatus?.transactionHash).to.not.be.null;
      expect(msgStatus?.state).to.eq('Success');
    });

    it('correctly save tokenPriceInEth', async () => {
      const messageOverrides = {...msg, gasToken: mockToken.address, gasPrice: TEST_GAS_PRICE_IN_TOKEN};
      const signedMessage = getTestSignedMessage(messageOverrides, wallet.privateKey);
      const {messageHash} = await messageHandler.handle(signedMessage);
      expect(await messageHandler.isPresent(messageHash)).to.be.true;
      const messageItem = await messageRepository.get(messageHash);
      expect(messageItem.tokenPriceInEth).be.eq(TEST_TOKEN_PRICE_IN_ETH.toString());
    });
  });

  describe('Add Key', () => {
    it('execute add key', async () => {
      msg = {...addKeyMessage, from: walletContract.address, to: walletContract.address, nonce: await walletContract.lastNonce(), refundReceiver: wallet.address};
      const signedMessage = getTestSignedMessage(msg, wallet.privateKey);

      await messageHandler.handle(signedMessage);
      await executionWorker.stopLater();
      expect(await walletContract.keyExist(otherWallet.address)).to.be.true;
    });

    describe('Collaboration with Authorisation Service', () => {
      it('should remove request from pending authorisations if addKey', async () => {
        const request = {walletContractAddress: walletContract.address, key: otherWallet.address, deviceInfo: defaultDeviceInfo};
        await authorisationStore.addRequest(request);
        msg = {...addKeyMessage, from: walletContract.address, to: walletContract.address, nonce: await walletContract.lastNonce(), refundReceiver: wallet.address};
        const signedMessage = getTestSignedMessage(msg, wallet.privateKey);
        await messageHandler.handle(signedMessage);
        await executionWorker.stopLater();
        const authorisations = await authorisationStore.getPendingAuthorisations(walletContract.address);
        expect(authorisations).to.deep.eq([]);
        expect(await devicesStore.get(walletContract.address)).length(1);
      });
    });
  });

  describe('Add Keys', () => {
    it('execute add keys', async () => {
      const keys = [otherWallet.address];
      const data = encodeFunction(beta2.WalletContract, 'addKeys', [keys]);
      msg = {...addKeyMessage, from: walletContract.address, to: walletContract.address, nonce: await walletContract.lastNonce(), data, refundReceiver: wallet.address};
      const signedMessage0 = getTestSignedMessage(msg, wallet.privateKey);
      await messageHandler.handle(signedMessage0);
      await executionWorker.stopLater();
      expect(await walletContract.keyExist(otherWallet.address)).to.be.true;
      const devices = await devicesStore.get(walletContract.address);
      expect(devices.map(({publicKey}) => publicKey)).to.deep.eq(keys);
    });
  });

  describe('Remove key ', () => {
    beforeEach(async () => {
      const message = {...addKeyMessage, from: walletContract.address, to: walletContract.address, nonce: await walletContract.lastNonce(), refundReceiver: wallet.address};
      const signedMessage = getTestSignedMessage(message, wallet.privateKey);

      await messageHandler.handle(signedMessage);
    });

    it('should remove key', async () => {
      await waitExpect(async () => expect((await walletContract.keyExist(otherWallet.address))).to.be.true);
      const message = {...removeKeyMessage, from: walletContract.address, to: walletContract.address, nonce: await walletContract.lastNonce(), refundReceiver: wallet.address};
      const signedMessage = getTestSignedMessage(message, wallet.privateKey);

      await messageHandler.handle(signedMessage);
      await executionWorker.stopLater();
      expect(await devicesStore.get(walletContract.address)).to.deep.eq([]);
      expect(await walletContract.keyExist(otherWallet.address)).to.eq(false);
    });
  });

  describe('Ensure correct execution', () => {
    it('should throw when pending signedMessage already has transaction hash', async () => {
      const signedMessage = getTestSignedMessage(msg, wallet.privateKey);
      const {messageHash} = await messageHandler.handle(signedMessage);
      await (messageHandler as any).messageRepository.markAsPending(messageHash, '0x829751e6e6b484a2128924ce59c2ff518acf07fd345831f0328d117dfac30cec', '2020');
      const status = await messageHandler.getStatus(messageHash);
      expect(() => messageHandler.ensureCorrectExecution(status!, 1))
        .throws('Execution request already processed');
    });

    it('should throw error when pending signedMessage has not enough signatures', async () => {
      const signedMessage = getTestSignedMessage(msg, wallet.privateKey);
      const {messageHash} = await messageHandler.handle(signedMessage);
      const status = await messageHandler.getStatus(messageHash);
      expect(status).to.not.be.null;
      expect(() => messageHandler.ensureCorrectExecution(status!, 2))
        .throws('Not enough signatures, required 2, got only 1');
    });
  });

  after(async () => {
    await knex.destroy();
  });
});

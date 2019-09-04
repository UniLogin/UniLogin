import {expect} from 'chai';
import sinon, {SinonSpy} from 'sinon';
import {Wallet, Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {calculateMessageHash, createSignedMessage, SignedMessage, TEST_MESSAGE_HASH} from '@universal-login/commons';
import {executeSetRequiredSignatures} from '@universal-login/contracts/testutils';
import PendingMessages from '../../../../../lib/core/services/messages/PendingMessages';
import basicWalletContractWithMockToken from '../../../../fixtures/basicWalletContractWithMockToken';
import MessageSQLRepository from '../../../../../lib/integration/sql/services/MessageSQLRepository';
import {getKeyFromHashAndSignature, createMessageItem} from '../../../../../lib/core/utils/utils';
import {getKnexConfig} from '../../../../helpers/knex';
import {clearDatabase} from '../../../../../lib/http/relayers/RelayerUnderTest';
import {MessageStatusService} from '../../../../../lib/core/services/messages/MessageStatusService';
import {SignaturesService} from '../../../../../lib/integration/ethereum/SignaturesService';

describe('INT: PendingMessages', () => {
  let pendingMessages : PendingMessages;
  let messageRepository: MessageSQLRepository;
  let signaturesService: SignaturesService;
  let statusService: MessageStatusService;
  let message : SignedMessage;
  let wallet: Wallet;
  let walletContract: Contract;
  let actionKey: string;
  const knex = getKnexConfig();
  let spy: SinonSpy;
  let messageHash: string;

  beforeEach(async () => {
    ({ wallet, walletContract, actionKey } = await loadFixture(basicWalletContractWithMockToken));
    messageRepository = new MessageSQLRepository(knex);
    spy = sinon.fake.returns({hash: '0x0000000000000000000000000000000000000000000000000000000000000000'});
    signaturesService = new SignaturesService(wallet);
    statusService = new MessageStatusService(messageRepository, signaturesService);
    pendingMessages = new PendingMessages(wallet, messageRepository, {add: spy} as any, statusService);
    message = createSignedMessage({from: walletContract.address, to: '0x'}, wallet.privateKey);
    messageHash = calculateMessageHash(message);
    await executeSetRequiredSignatures(walletContract, 2, wallet.privateKey);
  });

  afterEach(async () => {
    await clearDatabase(knex);
  });

  it('not present initally', async () => {
    expect(await pendingMessages.isPresent(TEST_MESSAGE_HASH)).to.be.false;
  });

  it('should be addded', async () => {
    await pendingMessages.add(message);
    expect(await pendingMessages.isPresent(messageHash)).to.be.true;
  });

  it('getStatus should throw error', async () => {
    await expect(pendingMessages.getStatus(messageHash)).to.eventually.rejectedWith(`Could not find message with hash: ${messageHash}`);
  });

  it('should check if execution is ready to execute and execution callback', async () => {
    const signedMessage = createSignedMessage(message, actionKey);
    await pendingMessages.add(message);
    expect(await pendingMessages.isEnoughSignatures(messageHash)).to.eq(false);
    expect(spy.calledOnce).to.be.false;
    await pendingMessages.add(signedMessage);
    expect(spy.calledOnce).to.be.true;
  });

  it('should get added signed transaction', async () => {
    const messageItem = createMessageItem(message);
    await pendingMessages.add(message);
    const key = getKeyFromHashAndSignature(messageHash, message.signature);
    await messageItem.collectedSignatureKeyPairs.push({signature: message.signature, key});
    expect((await messageRepository.get(messageHash)).toString()).to.eq(messageItem.toString());
  });

  describe('Add', async () => {

    it('should push one signature', async () => {
      await pendingMessages.add(message);
      const status = await pendingMessages.getStatus(messageHash);
      const {collectedSignatures, state} = status;
      expect(status.collectedSignatures.length).to.be.eq(1);
      expect(state).to.be.eq('AwaitSignature');
      expect(collectedSignatures[0]).to.be.eq(message.signature);
    });

    it('should sign message', async () => {
      const signedMessage = createSignedMessage(message, actionKey);
      await pendingMessages.add(message);
      await pendingMessages.add(signedMessage);
      const {collectedSignatures} = await pendingMessages.getStatus(messageHash);
      expect(collectedSignatures).to.be.deep.eq([message.signature, signedMessage.signature]);
    });

    it('should not accept same signature twice', async () => {
      await pendingMessages.add(message);
      await expect(pendingMessages.add(message))
          .to.be.rejectedWith('Signature already collected');
    });
  });

  describe('Ensure correct execution', async () =>  {
    it('should throw when pending message already has transaction hash', async () => {
      await pendingMessages.add(message);
      await messageRepository.markAsPending(messageHash, '0x829751e6e6b484a2128924ce59c2ff518acf07fd345831f0328d117dfac30cec');
      await expect(pendingMessages.ensureCorrectExecution(messageHash))
          .to.be.eventually.rejectedWith('Execution request already processed');
    });

    it('should throw error when pending message has not enough signatures', async () => {
      await pendingMessages.add(message);
      await expect(pendingMessages.ensureCorrectExecution(messageHash))
        .to.be.eventually.rejectedWith('Not enough signatures, required 2, got only 1');
    });
  });

  after(async () => {
    await knex.destroy();
  });
});

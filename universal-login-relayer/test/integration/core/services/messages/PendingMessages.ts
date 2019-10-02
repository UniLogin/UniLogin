import {expect} from 'chai';
import sinon, {SinonSpy} from 'sinon';
import {Wallet, Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {calculateMessageHash, SignedMessage, TEST_MESSAGE_HASH, TEST_ACCOUNT_ADDRESS, UnsignedMessage} from '@universal-login/commons';
import {emptyMessage, messageToUnsignedMessage, unsignedMessageToSignedMessage} from '@universal-login/contracts';
import {executeSetRequiredSignatures} from '@universal-login/contracts/testutils';
import PendingMessages from '../../../../../lib/core/services/messages/PendingMessages';
import basicWalletContractWithMockToken from '../../../../fixtures/basicWalletContractWithMockToken';
import MessageSQLRepository from '../../../../../lib/integration/sql/services/MessageSQLRepository';
import {getKeyFromHashAndSignature} from '../../../../../lib/core/utils/encodeData';
import {getKnexConfig} from '../../../../helpers/knex';
import {clearDatabase} from '../../../../../lib/http/relayers/RelayerUnderTest';
import {MessageStatusService} from '../../../../../lib/core/services/messages/MessageStatusService';
import {SignaturesService} from '../../../../../lib/integration/ethereum/SignaturesService';
import {createMessageItem} from '../../../../../lib/core/utils/messages/serialisation';

describe('INT: PendingMessages', () => {
  let pendingMessages : PendingMessages;
  let messageRepository: MessageSQLRepository;
  let signaturesService: SignaturesService;
  let statusService: MessageStatusService;
  let unsignedMessage: UnsignedMessage;
  let signedMessage : SignedMessage;
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
    pendingMessages = new PendingMessages(wallet, messageRepository, {addMessage: spy} as any, statusService);
    unsignedMessage = messageToUnsignedMessage({...emptyMessage, from: walletContract.address, to: TEST_ACCOUNT_ADDRESS});
    signedMessage = unsignedMessageToSignedMessage(unsignedMessage, wallet.privateKey);
    messageHash = calculateMessageHash(signedMessage);
    await executeSetRequiredSignatures(walletContract, 2, wallet.privateKey);
  });

  afterEach(async () => {
    await clearDatabase(knex);
  });

  it('not present initally', async () => {
    expect(await pendingMessages.isPresent(TEST_MESSAGE_HASH)).to.be.false;
  });

  it('should be addded', async () => {
    await pendingMessages.add(signedMessage);
    expect(await pendingMessages.isPresent(messageHash)).to.be.true;
  });

  it('getStatus should throw error', async () => {
    await expect(pendingMessages.getStatus(messageHash)).to.eventually.rejectedWith(`Could not find message with hash: ${messageHash}`);
  });

  it('should check if execution is ready to execute and execution callback', async () => {
    const signedMessage2 = unsignedMessageToSignedMessage(unsignedMessage, actionKey);
    await pendingMessages.add(signedMessage);
    expect(await pendingMessages.isEnoughSignatures(messageHash)).to.eq(false);
    expect(spy.calledOnce).to.be.false;
    await pendingMessages.add(signedMessage2);
    expect(spy.calledOnce).to.be.true;
  });

  it('should get added signed transaction', async () => {
    const messageItem = createMessageItem(signedMessage);
    await pendingMessages.add(signedMessage);
    const key = getKeyFromHashAndSignature(messageHash, signedMessage.signature);
    await messageItem.collectedSignatureKeyPairs.push({signature: signedMessage.signature, key});
    expect((await messageRepository.get(messageHash)).toString()).to.eq(messageItem.toString());
  });

  describe('Add', async () => {

    it('should push one signature', async () => {
      await pendingMessages.add(signedMessage);
      const status = await pendingMessages.getStatus(messageHash);
      const {collectedSignatures, state} = status;
      expect(status.collectedSignatures.length).to.be.eq(1);
      expect(state).to.be.eq('AwaitSignature');
      expect(collectedSignatures[0]).to.be.eq(signedMessage.signature);
    });

    it('should sign signedMessage', async () => {
      const signedMessage2 = unsignedMessageToSignedMessage(unsignedMessage, actionKey);
      await pendingMessages.add(signedMessage);
      await pendingMessages.add(signedMessage2);
      const {collectedSignatures} = await pendingMessages.getStatus(messageHash);
      expect(collectedSignatures).to.be.deep.eq([signedMessage.signature, signedMessage2.signature]);
    });

    it('should not accept same signature twice', async () => {
      await pendingMessages.add(signedMessage);
      await expect(pendingMessages.add(signedMessage))
          .to.be.rejectedWith('Signature already collected');
    });
  });

  describe('Ensure correct execution', async () =>  {
    it('should throw when pending signedMessage already has transaction hash', async () => {
      await pendingMessages.add(signedMessage);
      await messageRepository.markAsPending(messageHash, '0x829751e6e6b484a2128924ce59c2ff518acf07fd345831f0328d117dfac30cec');
      await expect(pendingMessages.ensureCorrectExecution(messageHash))
          .to.be.eventually.rejectedWith('Execution request already processed');
    });

    it('should throw error when pending signedMessage has not enough signatures', async () => {
      await pendingMessages.add(signedMessage);
      await expect(pendingMessages.ensureCorrectExecution(messageHash))
        .to.be.eventually.rejectedWith('Not enough signatures, required 2, got only 1');
    });
  });

  after(async () => {
    await knex.destroy();
  });
});

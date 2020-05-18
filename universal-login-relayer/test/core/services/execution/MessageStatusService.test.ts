import {calculateMessageHash, SignedMessage, TEST_TRANSACTION_HASH} from '@unilogin/commons';
import {expect} from 'chai';
import {utils} from 'ethers';
import sinon from 'sinon';
import MessageItem from '../../../../src/core/models/messages/MessageItem';
import {MessageStatusService} from '../../../../src/core/services/execution/messages/MessageStatusService';
import {getTestSignedMessage} from '../../../testconfig/message';
import MessageMemoryRepository from '../../../mock/MessageMemoryRepository';
import {createTestMessageItem} from '../../../testhelpers/createTestMessageItem';

describe('UNIT: MessageStatusService', () => {
  const contractService: any = {
    getRequiredSignatures: sinon.stub().returns(utils.bigNumberify(1)),
  };
  let messageRepository: MessageMemoryRepository;
  let messageStatusService: MessageStatusService;
  let message: SignedMessage;
  let messageItem: MessageItem;
  let messageHash: string;

  beforeEach(async () => {
    messageRepository = new MessageMemoryRepository();
    messageStatusService = new MessageStatusService(messageRepository, contractService);
    message = getTestSignedMessage();
    messageItem = createTestMessageItem(message);
    messageHash = calculateMessageHash(message);
    await messageRepository.add(messageHash, messageItem);
  });

  it('getStatus for newly created Message', async () => {
    expect(await messageStatusService.getStatus(messageHash)).to.deep.eq({
      collectedSignatures: [],
      totalCollected: 0,
      state: 'AwaitSignature',
      messageHash,
    });
  });

  it('getStatus after adding a signature', async () => {
    await messageRepository.addSignature(messageHash, message.signature);
    expect(await messageStatusService.getStatus(messageHash)).to.deep.eq({
      collectedSignatures: [message.signature],
      totalCollected: 1,
      state: 'AwaitSignature',
      messageHash,
    });
  });

  it('getStatus after being queued', async () => {
    await messageRepository.setState(messageHash, 'Queued');
    expect(await messageStatusService.getStatus(messageHash)).to.include({state: 'Queued'});
  });

  it('getStatus after starting handle', async () => {
    await messageRepository.markAsPending(messageHash, TEST_TRANSACTION_HASH, '1');
    expect(await messageStatusService.getStatus(messageHash)).to.deep.include({
      state: 'Pending',
      transactionHash: TEST_TRANSACTION_HASH,
    });
  });

  it('getStatus after error', async () => {
    await messageRepository.markAsError(messageHash, 'Error message');
    expect(await messageStatusService.getStatus(messageHash)).to.include({
      state: 'Error',
      error: 'Error message',
    });
  });
});

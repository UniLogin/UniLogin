import {expect} from 'chai';
import sinon from 'sinon';
import {utils} from 'ethers';
import {SignedMessage, calculateMessageHash, TEST_TRANSACTION_HASH} from '@universal-login/commons';
import MessageMemoryRepository from '../../helpers/MessageMemoryRepository';
import {MessageStatusService} from '../../../lib/core/services/messages/MessageStatusService';
import MessageItem from '../../../lib/core/models/messages/MessageItem';
import {createMessageItem} from '../../../lib/core/utils/utils';
import getTestSignedMessage from '../../config/message';

describe('UNIT: MessageStatusService', async () => {
  const signaturesService : any = {
    getRequiredSignatures: sinon.stub().returns(utils.bigNumberify(1))
  };
  let messageRepository : MessageMemoryRepository;
  let messageStatusService : MessageStatusService;
  let message: SignedMessage;
  let messageItem: MessageItem;
  let messageHash: string;

  beforeEach(async () => {
    messageRepository = new MessageMemoryRepository();
    messageStatusService = new MessageStatusService(messageRepository, signaturesService);
    message = getTestSignedMessage();
    messageItem = createMessageItem(message);
    messageHash = calculateMessageHash(message);
    await messageRepository.add(messageHash, messageItem);
  });

  it('getStatus for newly created Message', async () => {
    expect(await messageStatusService.getStatus(messageHash)).to.deep.eq({
      collectedSignatures: [],
      totalCollected: 0,
      required: 1,
      state: 'AwaitSignature',
      messageHash
    });
  });

  it('getStatus after adding a signature', async () => {
    await messageRepository.addSignature(messageHash, message.signature);
    expect(await messageStatusService.getStatus(messageHash)).to.deep.eq({
      collectedSignatures: [message.signature],
      totalCollected: 1,
      required: 1,
      state: 'AwaitSignature',
      messageHash
    });
  });

  it('getStatus after being queued', async () => {
    await messageRepository.setMessageState(messageHash, 'Queued');
    expect(await messageStatusService.getStatus(messageHash)).to.include({state: 'Queued'});
  });

  it('getStatus after success', async () => {
    await messageRepository.markAsPending(messageHash, TEST_TRANSACTION_HASH);
    expect(await messageStatusService.getStatus(messageHash)).to.deep.include({
      state: 'Pending',
      transactionHash: TEST_TRANSACTION_HASH
    });
  });

  it('getStatus after error', async () => {
    await messageRepository.markAsError(messageHash, 'Error message');
    expect(await messageStatusService.getStatus(messageHash)).to.include({
      state: 'Error',
      error: 'Error message'
    });
  });
});

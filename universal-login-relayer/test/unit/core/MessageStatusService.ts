import {expect} from 'chai';
import sinon from 'sinon';
import {utils} from 'ethers';
import {SignedMessage, calculateMessageHash, TEST_TRANSACTION_HASH, MessageStatus} from '@universal-login/commons';
import MessageMemoryRepository from '../../helpers/MessageMemoryRepository';
import {MessageStatusService} from '../../../lib/core/services/messages/MessageStatusService';
import MessageItem from '../../../lib/core/models/messages/MessageItem';
import {createMessageItem} from '../../../lib/core/utils/utils';
import {SignaturesService} from '../../../lib/integration/ethereum/SignaturesService';
import getTestSignedMessage from '../../config/message';

describe('UNIT: MessageStatusService', async () => {
  let messageRepository: MessageMemoryRepository;
  let messageStatusService: MessageStatusService;
  let signaturesService: SignaturesService;
  let message: SignedMessage;
  let messageItem: MessageItem;
  let messageHash: string;

  before(async () => {
    messageRepository = new MessageMemoryRepository();
    signaturesService = {
      getRequiredSignatures: sinon.stub().returns(utils.bigNumberify(1))
    } as any;
    messageStatusService = new MessageStatusService(messageRepository, signaturesService);
    message = await getTestSignedMessage();
    messageItem = createMessageItem(message);
    messageHash = calculateMessageHash(message);
  });

  it('getStatus roundtrip', async () => {
    await messageRepository.add(messageHash, messageItem);
    let expectedStatus: MessageStatus = {
      collectedSignatures: [] as any,
      totalCollected: 0,
      required: 1,
      state: 'AwaitSignature'
    };
    expect(await messageStatusService.getStatus(messageHash)).to.deep.eq(expectedStatus);
    await messageRepository.addSignature(messageHash, message.signature);
    expectedStatus = {
      ...expectedStatus,
      collectedSignatures: [message.signature],
      totalCollected: 1
    };
    expect(await messageStatusService.getStatus(messageHash)).to.deep.eq(expectedStatus);
    await messageRepository.setMessageState(messageHash, 'Queued');
    expectedStatus.state = 'Queued';
    expect(await messageStatusService.getStatus(messageHash)).to.deep.eq(expectedStatus);
    await messageRepository.markAsSuccess(messageHash, TEST_TRANSACTION_HASH);
    expectedStatus.state = 'Success';
    expectedStatus.transactionHash = TEST_TRANSACTION_HASH;
    expect(await messageStatusService.getStatus(messageHash)).to.deep.eq(expectedStatus);
  });
});

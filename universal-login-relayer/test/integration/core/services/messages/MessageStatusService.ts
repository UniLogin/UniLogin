import {expect} from 'chai';
import {loadFixture} from 'ethereum-waffle';
import {SignedMessage, createSignedMessage, calculateMessageHash} from '@universal-login/commons';
import MessageMemoryRepository from '../../../../helpers/MessageMemoryRepository';
import {MessageStatusService} from '../../../../../lib/core/services/messages/MessageStatusService';
import basicWalletContractWithMockToken from '../../../../fixtures/basicWalletContractWithMockToken';
import MessageItem from '../../../../../lib/core/models/messages/MessageItem';
import {createMessageItem} from '../../../../../lib/core/utils/utils';
import {SignaturesService} from '../../../../../lib/integration/ethereum/SignaturesService';

describe('INT: MessageStatusService', async () => {
  let messageRepository: MessageMemoryRepository;
  let messageStatusService: MessageStatusService;
  let signaturesService: SignaturesService;
  let message: SignedMessage;
  let messageItem: MessageItem;
  let messageHash: string;

  before(async () => {
    const {wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken);

    messageRepository = new MessageMemoryRepository();
    signaturesService = new SignaturesService(wallet);
    messageStatusService = new MessageStatusService(messageRepository, signaturesService);

    message = await createSignedMessage({from: walletContract.address, to: '0x'}, wallet.privateKey);

    messageItem = createMessageItem(message);
    messageHash = calculateMessageHash(message);
  });

  it('getStatus roundtrip', async () => {
    await messageRepository.add(messageHash, messageItem);
    const expectedStatus = {
      collectedSignatures: [] as any,
      totalCollected: 0,
      required: 1,
      state: 'AwaitSignature'
    };
    expect(await messageStatusService.getStatus(messageHash)).to.deep.eq(expectedStatus);
    await messageRepository.addSignature(messageHash, message.signature);
    expect(await messageStatusService.getStatus(messageHash)).to.deep.eq(
      {
        ...expectedStatus,
        collectedSignatures: [message.signature],
        totalCollected: 1
      });
  });
});

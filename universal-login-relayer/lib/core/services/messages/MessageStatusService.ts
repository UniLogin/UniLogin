import {MessageStatus} from '@universal-login/commons';
import IMessageRepository from './IMessagesRepository';
import {SignaturesService} from '../../../integration/ethereum/SignaturesService';

export class MessageStatusService {
  constructor(private messageRepository: IMessageRepository, private signaturesService: SignaturesService) {
  }

  async getStatus(messageHash: string) {
    const message = await this.messageRepository.get(messageHash);
    const required = await this.signaturesService.getRequiredSignatures(message.walletAddress);
    const status: MessageStatus =  {
      collectedSignatures: message.collectedSignatureKeyPairs.map((collected) => collected.signature),
      totalCollected: message.collectedSignatureKeyPairs.length,
      required: required.toNumber(),
      state: message.state,
      messageHash
    };
    const {error, transactionHash} = message;
    if (error) {
      status.error = error;
    }
    if (transactionHash) {
      status.transactionHash = transactionHash;
    }
    return status;
  }
}

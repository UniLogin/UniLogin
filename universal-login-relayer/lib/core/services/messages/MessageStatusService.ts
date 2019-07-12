import {Wallet} from 'ethers';
import {MessageStatus} from '@universal-login/commons';
import IMessageRepository from './IMessagesRepository';
import {getRequiredSignatures} from '../../utils/utils';

export class MessageStatusService {
  constructor(private messageRepository: IMessageRepository, private wallet: Wallet) {
  }

  async getStatus(messageHash: string) {
    const message = await this.messageRepository.get(messageHash);
    const required = await getRequiredSignatures(message.walletAddress, this.wallet);
    const status: MessageStatus =  {
      collectedSignatures: message.collectedSignatureKeyPairs.map((collected) => collected.signature),
      totalCollected: message.collectedSignatureKeyPairs.length,
      required: required.toNumber(),
      state: message.state
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

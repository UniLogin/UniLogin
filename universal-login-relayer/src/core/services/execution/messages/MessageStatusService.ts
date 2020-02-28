import {MessageStatus} from '@unilogin/commons';
import IMessageRepository from '../../../models/messages/IMessagesRepository';
import {WalletContractService} from '../../../../integration/ethereum/WalletContractService';
import {utils} from 'ethers';

export class MessageStatusService {
  constructor(private messageRepository: IMessageRepository, private walletContractService: WalletContractService) {
  }

  async getStatus(messageHash: string) {
    const message = await this.messageRepository.get(messageHash);
    console.log('MessageStatusService')
    const status: MessageStatus = {
      collectedSignatures: message.collectedSignatureKeyPairs.map((collected) => collected.signature),
      totalCollected: message.collectedSignatureKeyPairs.length,
      state: message.state,
      messageHash,
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

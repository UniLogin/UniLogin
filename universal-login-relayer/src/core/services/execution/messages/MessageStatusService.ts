import {MessageStatus} from '@universal-login/commons';
import IMessageRepository from '../../../models/messages/IMessagesRepository';
import {WalletContractService} from '../../../../integration/ethereum/WalletContractService';
import {ContractService} from '../../../../integration/ethereum/ContractService';

export class MessageStatusService {
  constructor(private messageRepository: IMessageRepository, private walletContractService: ContractService) {
  }

  async getStatus(messageHash: string) {
    const message = await this.messageRepository.get(messageHash);
    const required = await this.walletContractService.getRequiredSignatures(message.walletAddress);
    const status: MessageStatus = {
      collectedSignatures: message.collectedSignatureKeyPairs.map((collected) => collected.signature),
      totalCollected: message.collectedSignatureKeyPairs.length,
      required: required.toNumber(),
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

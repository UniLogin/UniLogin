import {Message, PartialRequired} from '@unilogin/commons';
import {messageToSignedMessage, ContractService} from '@unilogin/contracts';

export class MessageConverter {
  constructor(private contractService: ContractService) {
  }

  async messageToSignedMessage(message: PartialRequired<Message, 'from'>, privateKey: string) {
    const networkVersion = await this.contractService.fetchHardforkVersion();
    const walletVersion = await this.contractService.fetchWalletVersion(message.from);
    return messageToSignedMessage(message, privateKey, networkVersion, walletVersion);
  }
}

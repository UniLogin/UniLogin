import {Message, PartialRequired, ProviderService} from '@unilogin/commons';
import {messageToSignedMessage, ContractService} from '@unilogin/contracts';

export class MessageConverter {
  constructor(private contractService: ContractService, private providerService: ProviderService) {
  }

  async messageToSignedMessage(message: PartialRequired<Message, 'from'>, privateKey: string) {
    const networkVersion = await this.providerService.fetchHardforkVersion();
    const walletVersion = await this.contractService.fetchWalletVersion(message.from);
    return messageToSignedMessage(message, privateKey, networkVersion, walletVersion);
  }
}

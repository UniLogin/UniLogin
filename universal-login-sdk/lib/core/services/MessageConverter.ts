import {Message, PartialRequired} from '@universal-login/commons';
import {messageToSignedMessage, BlockchainService} from '@universal-login/contracts';

export class MessageConverter {
  constructor(private blockchainService: BlockchainService) {
  }

  async messageToSignedMessage(message: PartialRequired<Message, 'from'>, privateKey: string) {
    const networkVersion = await this.blockchainService.fetchHardforkVersion();
    const walletVersion = await this.blockchainService.fetchWalletVersion(message.from);
    return messageToSignedMessage(message, privateKey, networkVersion, walletVersion);
  }
}

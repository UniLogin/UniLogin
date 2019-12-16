import {Message} from '@universal-login/commons';
import {calculatebaseGas, BlockchainService} from '@universal-login/contracts';

export class GasComputation {
  constructor(private blockchainService: BlockchainService) {
  }

  async calculatebaseGas(message: Omit<Message, 'gasLimit'>) {
    const networkVersion = await this.blockchainService.fetchHardforkVersion();
    const walletVersion = await this.blockchainService.fetchWalletVersion(message.from);
    return calculatebaseGas(message, networkVersion, walletVersion);
  }
}

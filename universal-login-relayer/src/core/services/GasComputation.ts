import {Message} from '@universal-login/commons';
import {calculateBaseGas, BlockchainService} from '@universal-login/contracts';

export class GasComputation {
  constructor(private blockchainService: BlockchainService) {
  }

  async calculateBaseGas(message: Omit<Message, 'gasLimit'>) {
    const networkVersion = await this.blockchainService.fetchHardforkVersion();
    const walletVersion = await this.blockchainService.fetchWalletVersion(message.from);
    return calculateBaseGas(message, networkVersion, walletVersion);
  }
}

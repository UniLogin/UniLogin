import {Message} from '@universal-login/commons';
import {calculateGasBase, BlockchainService} from '@universal-login/contracts';

export class GasComputation {
  constructor(private blockchainService: BlockchainService) {

  }

  async calculateGasBase(message: Omit<Message, 'gasLimit'>) {
    const walletVersion = await this.blockchainService.fetchWalletVersion(message.from);
    return calculateGasBase(message);
  }
}

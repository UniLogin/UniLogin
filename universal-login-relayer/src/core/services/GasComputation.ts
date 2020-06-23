import {Message} from '@unilogin/commons';
import {calculateBaseGas, ContractService, ProviderService} from '@unilogin/contracts';

export class GasComputation {
  constructor(private contractService: ContractService, private providerService: ProviderService) {
  }

  async calculateBaseGas(message: Omit<Message, 'gasLimit'>) {
    const networkVersion = await this.providerService.fetchHardforkVersion();
    const walletVersion = await this.contractService.fetchWalletVersion(message.from);
    return calculateBaseGas(message, networkVersion, walletVersion);
  }
}

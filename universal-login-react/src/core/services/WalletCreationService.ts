import {WalletService} from '@universal-login/sdk';
import {GasParameters, INITIAL_GAS_PARAMETERS} from '@universal-login/commons';

export class WalletCreationService {
  private gasParameters: GasParameters = INITIAL_GAS_PARAMETERS;
  private callbackOnBalancePresent: (() => void) | undefined;

  constructor(
    private readonly walletService: WalletService,
  ) {
  }

  async initiateCreationFlow(ensName: string) {
    const {waitForBalance} = await this.walletService.createFutureWallet();
    await waitForBalance();
    this.callbackOnBalancePresent && this.callbackOnBalancePresent();
    return this.walletService.deployFutureWallet(
      ensName,
      this.gasParameters.gasPrice.toString(),
      this.gasParameters.gasToken,
    );
  }

  setGasParameters(gasParameters: GasParameters) {
    this.gasParameters = gasParameters;
  }

  onBalancePresent(cb: () => void) {
    this.callbackOnBalancePresent = cb;
  }
}

import {WalletService} from '@universal-login/sdk';
import {GasParameters, INITIAL_GAS_PARAMETERS} from '@universal-login/commons';
import {State} from 'reactive-properties';

export class WalletCreationService {
  private gasParameters: GasParameters = INITIAL_GAS_PARAMETERS;
  private callbackOnBalancePresent: (() => void) | undefined;
  deploymentTransactionHash = new State<string | undefined>(undefined);

  constructor(
    private readonly walletService: WalletService,
  ) {
  }

  async initiateCreationFlow(ensName: string) {
    this.deploymentTransactionHash.set(undefined);
    const {waitForBalance} = await this.walletService.createFutureWallet();
    await waitForBalance();
    this.callbackOnBalancePresent && this.callbackOnBalancePresent();
    await this.walletService.deployFutureWallet(
      ensName,
      this.gasParameters.gasPrice.toString(),
      this.gasParameters.gasToken,
      (txHash) => this.deploymentTransactionHash.set(txHash),
    );
  }

  setGasParameters(gasParameters: GasParameters) {
    this.gasParameters = gasParameters;
  }

  onBalancePresent(cb: () => void) {
    this.callbackOnBalancePresent = cb;
  }
}

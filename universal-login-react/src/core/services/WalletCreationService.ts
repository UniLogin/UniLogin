import {WalletService} from '@universal-login/sdk';
import {ensure, GasParameters, INITIAL_GAS_PARAMETERS} from '@universal-login/commons';
import {waitFor} from 'reactive-properties';

export class WalletCreationService {
  private gasParameters: GasParameters = INITIAL_GAS_PARAMETERS;

  constructor(
    private readonly walletService: WalletService,
  ) {
  }

  async deployWhenReady(onBalancePresent?: () => void) {
    const state = await this.walletService.stateProperty.pipe(
      waitFor(state => state.kind === 'Future'),
    );
    ensure(state.kind === 'Future', Error, 'Invalid state');

    await state.wallet.waitForBalance();
    onBalancePresent?.();
    return this.walletService.deployFutureWallet(this.gasParameters.gasPrice.toString(), this.gasParameters.gasToken);
  }

  async initiateCreationFlow(ensName: string) {
    await this.walletService.createFutureWallet(ensName);
  }

  setGasParameters(gasParameters: GasParameters) {
    this.gasParameters = gasParameters;
  }
}

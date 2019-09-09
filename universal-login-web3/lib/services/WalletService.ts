import UniversalLoginSDK, {FutureWallet, DeployedWallet} from '@universal-login/sdk';

export type WalletState = {
  kind: 'none'
} | {
  kind: 'future'
  futureWallet: FutureWallet
} | {
  kind: 'deployed'
  deployedWallet: DeployedWallet
};

export class WalletService {
  private state: WalletState = {kind: 'none'};

  constructor(
    private sdk: UniversalLoginSDK,
  ) {
  }

  async createFutureWallet() {
    const futureWallet = await this.sdk.createFutureWallet();
    this.state = {kind: 'future', futureWallet};
    return futureWallet;
  }

  setDeployed(ensName: string) {
    if (this.state.kind !== 'future') {
      throw new Error('Invalid state: future wallet expected');
    }
    const deployedWallet = new DeployedWallet(
      this.state.futureWallet.contractAddress,
      ensName,
      this.state.futureWallet.privateKey,
      this.sdk,
    );
    this.state = {kind: 'deployed', deployedWallet};
  }
}

import UniversalLoginSDK from '@universal-login/sdk';

export class WalletService {
  constructor(
    private sdk: UniversalLoginSDK,
  ) {
  }

  createFutureWallet() {
    // TODO: set future wallet
    return this.sdk.createFutureWallet();
  }

  setDeployed(ensName: string) {
    console.log('wallet deployed', ensName);
  }
}

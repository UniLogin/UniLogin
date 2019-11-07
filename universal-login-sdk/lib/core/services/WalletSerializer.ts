import {SerializedWalletState, WalletState} from '../models/WalletService';
import UniversalLoginSDK, {DeployedWallet} from '../..';

export class WalletSerializer {
  constructor(
    private readonly sdk: UniversalLoginSDK,
  ) {
  }

  serialize(state: WalletState): SerializedWalletState | undefined {
    switch (state.kind) {
      case 'None':
        return {kind: 'None'};
      case 'Future':
        return {
          kind: 'Future',
          wallet: {
            contractAddress: state.wallet.contractAddress,
            privateKey: state.wallet.privateKey,
          },
        };
      case 'Deployed':
        return {
          kind: 'Deployed',
          wallet: state.wallet.asApplicationWallet,
        };
    }
  }

  async deserialize(state: SerializedWalletState): Promise<WalletState> {
    switch (state.kind) {
      case 'None':
        return {kind: 'None'};
      case 'Future':
        return {
          kind: 'Future',
          wallet: await this.sdk.getFutureWalletFactory().createFromExistingCounterfactual(state.wallet),
        };
      case 'Deployed':
        return {
          kind: 'Deployed',
          wallet: new DeployedWallet(state.wallet.contractAddress, state.wallet.name, state.wallet.privateKey, this.sdk),
        };
      default:
        throw new TypeError('Invalid saved wallet state');
    }
  }
}

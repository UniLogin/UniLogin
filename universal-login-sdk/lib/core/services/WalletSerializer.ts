import {SerializedWalletState, WalletState} from '../models/WalletService';
import UniversalLoginSDK, {DeployedWallet} from '../..';
import {ConnectingWallet} from '../../api/DeployedWallet';

export class WalletSerializer {
  constructor(
    private readonly sdk: UniversalLoginSDK,
  ) {}

  serialize(state: WalletState): SerializedWalletState | undefined {
    switch (state.kind) {
      case 'None':
        return {kind: 'None'};
      case 'Future':
        return {
          kind: 'Future',
          name: state.name,
          wallet: {
            contractAddress: state.wallet.contractAddress,
            privateKey: state.wallet.privateKey,
          },
        };
      case 'Deploying':
        const {waitForTransactionHash, waitToBeSuccess, ...serializedWallet} = state.wallet;
        return {
          kind: 'Deploying',
          wallet: serializedWallet,
        };
      case 'Connecting':
        return {
          kind: 'Connecting',
          wallet: {
            contractAddress: state.wallet.contractAddress,
            privateKey: state.wallet.privateKey,
            name: state.wallet.name,
          },
        };
      case 'Deployed':
        return {
          kind: 'Deployed',
          wallet: state.wallet.asApplicationWallet,
        };
    }
  }

  deserialize(state: SerializedWalletState): WalletState {
    switch (state.kind) {
      case 'None':
        return {kind: 'None'};
      case 'Future':
        return {
          kind: 'Future',
          name: state.name,
          wallet: this.sdk.getFutureWalletFactory().createFromExistingCounterfactual(state.wallet),
        };
      case 'Deploying':
        return {
          kind: 'Deploying',
          wallet: this.sdk.getFutureWalletFactory().createDeployingWallet(state.wallet),
        };
      case 'Connecting':
        return {
          kind: 'Connecting',
          wallet: await new ConnectingWallet(state.wallet.contractAddress, state.wallet.name, state.wallet.privateKey),
        }
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

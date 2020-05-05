import {SerializedWalletState, WalletState} from '../models/WalletService';
import UniLoginSdk, {DeployedWallet} from '../..';
import {ConnectingWallet} from '../../api/wallet/ConnectingWallet';
import {DeployingWallet} from '../../api/wallet/DeployingWallet';

export class WalletSerializer {
  constructor(
    private readonly sdk: UniLoginSdk,
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
            ensName: state.wallet.ensName,
            gasPrice: state.wallet.gasPrice,
            gasToken: state.wallet.gasToken,
          },
        };
      case 'Deploying':
        const {name, privateKey, contractAddress, deploymentHash} = state.wallet;
        return {
          kind: 'Deploying',
          wallet: {name, privateKey, contractAddress, deploymentHash},
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
          wallet: this.sdk.getFutureWalletFactory().createFrom(state.wallet),
        };
      case 'Deploying':
        return {
          kind: 'Deploying',
          wallet: new DeployingWallet(state.wallet, this.sdk),
        };
      case 'Connecting':
        return {
          kind: 'Connecting',
          wallet: new ConnectingWallet(state.wallet.contractAddress, state.wallet.name, state.wallet.privateKey, this.sdk),
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

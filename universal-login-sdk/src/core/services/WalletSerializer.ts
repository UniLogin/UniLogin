import {SerializedWalletState, WalletState} from '../models/WalletService';
import UniLoginSdk, {DeployedWallet} from '../..';
import {ConnectingWallet} from '../../api/wallet/ConnectingWallet';
import {DeployingWallet} from '../../api/wallet/DeployingWallet';
import {RequestedCreatingWallet} from '../../api/wallet/RequestedCreatingWallet';
import {ConfirmedWallet} from '../../api/wallet/ConfirmedWallet';

export class WalletSerializer {
  constructor(
    private readonly sdk: UniLoginSdk,
  ) {}

  serialize(state: WalletState): SerializedWalletState | undefined {
    switch (state.kind) {
      case 'None':
        return {kind: 'None'};
      case 'RequestedCreating':
        return {
          kind: 'RequestedCreating',
          wallet: {
            email: state.wallet.email,
            ensName: state.wallet.ensName,
          },
        };
      case 'Confirmed':
        return {
          kind: 'Confirmed',
          wallet: {
            email: state.wallet.email,
            ensName: state.wallet.ensName,
            code: state.wallet.code,
          },
        };
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
      case 'RequestedCreating':
        return {
          kind: 'RequestedCreating',
          wallet: new RequestedCreatingWallet(this.sdk, state.wallet.email, state.wallet.ensName),
        };
      case 'Confirmed':
        return {
          kind: 'Confirmed',
          wallet: new ConfirmedWallet(state.wallet.email, state.wallet.ensName, state.wallet.code),
        };
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

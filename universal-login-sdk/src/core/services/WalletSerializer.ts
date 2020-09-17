import {SerializedWalletState, WalletState} from '../models/WalletService';
import UniLoginSdk, {DeployedWallet} from '../..';
import {ConnectingWallet} from '../../api/wallet/ConnectingWallet';
import {DeployingWallet} from '../../api/wallet/DeployingWallet';
import {RequestedCreatingWallet} from '../../api/wallet/RequestedCreatingWallet';
import {ConfirmedWallet} from '../../api/wallet/ConfirmedWallet';
import {RestoringWallet} from '../../api/wallet/RestoringWallet';
import {RequestedRestoringWallet} from '../../api/wallet/RequestedRestoringWallet';
import {DeployedWithoutEmailWallet} from '../../api/wallet/DeployedWallet';
import {RequestedMigratingWallet} from '../../api/wallet/RequestedMigrating';
import {ConfirmedMigratingWallet} from '../../api/wallet/ConfirmedMigratingWallet';

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
      case 'RequestedRestoring':
        return {
          kind: 'RequestedRestoring',
          wallet: state.wallet.asSerializableRequestedRestoringWallet,
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
      case 'Restoring':
        return {
          kind: 'Restoring',
          wallet: {
            encryptedWallet: state.wallet.encryptedWallet,
            email: state.wallet.email,
            ensName: state.wallet.ensName,
            contractAddress: state.wallet.contractAddress,
            gasToken: state.wallet.gasToken,
            gasPrice: state.wallet.gasPrice,
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
            email: state.wallet.email,
          },
        };
      case 'Deploying':
        const {name, privateKey, contractAddress, deploymentHash, email} = state.wallet;
        return {
          kind: 'Deploying',
          wallet: {name, privateKey, contractAddress, deploymentHash, email},
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
          wallet: state.wallet.asSerializedDeployedWallet,
        };
      case 'DeployedWithoutEmail':
        return {
          kind: 'DeployedWithoutEmail',
          wallet: state.wallet.asSerializedDeployedWithoutEmailWallet,
        };
      case 'RequestedMigrating':
        return {
          kind: 'RequestedMigrating',
          wallet: state.wallet.asSerializableRequestedMigratingWallet,
        };
      case 'ConfirmedMigrating':
        return {
          kind: 'ConfirmedMigrating',
          wallet: state.wallet.asSerializableConfirmedMigratingWallet,
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
      case 'RequestedRestoring':
        return {
          kind: 'RequestedRestoring',
          wallet: new RequestedRestoringWallet(this.sdk, state.wallet.ensNameOrEmail),
        };
      case 'Confirmed':
        return {
          kind: 'Confirmed',
          wallet: new ConfirmedWallet(state.wallet.email, state.wallet.ensName, state.wallet.code),
        };
      case 'Restoring':
        return {
          kind: 'Restoring',
          wallet: new RestoringWallet(state.wallet.encryptedWallet, state.wallet.email, state.wallet.ensName, state.wallet.contractAddress, state.wallet.gasToken, state.wallet.gasPrice, this.sdk),
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
          wallet: new DeployedWallet(state.wallet.contractAddress, state.wallet.name, state.wallet.privateKey, this.sdk, state.wallet.email),
        };
      case 'DeployedWithoutEmail':
        return {
          kind: 'DeployedWithoutEmail',
          wallet: new DeployedWithoutEmailWallet(state.wallet.contractAddress, state.wallet.name, state.wallet.privateKey, this.sdk),
        };
      case 'RequestedMigrating':
        return {
          kind: 'RequestedMigrating',
          wallet: new RequestedMigratingWallet(state.wallet.contractAddress, state.wallet.ensName, state.wallet.privateKey, state.wallet.email, this.sdk),
        };
      case 'ConfirmedMigrating':
        return {
          kind: 'ConfirmedMigrating',
          wallet: new ConfirmedMigratingWallet(state.wallet.contractAddress, state.wallet.ensName, state.wallet.privateKey, state.wallet.email, state.wallet.code, this.sdk),
        };
      default:
        throw new TypeError('Invalid saved wallet state');
    }
  }
}

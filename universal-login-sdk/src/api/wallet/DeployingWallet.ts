import {SerializedDeployingWallet} from '../..';
import {DeployedWallet, DeployedWithoutEmailWallet} from './DeployedWallet';
import {MineableFactory} from '../../core/services/MineableFactory';
import UniLoginSdk from '../sdk';

export class DeployingWallet extends MineableFactory implements SerializedDeployingWallet {
  name: string;
  contractAddress: string;
  privateKey: string;
  deploymentHash: string;
  email?: string;

  constructor(
    serializedDeployingWallet: SerializedDeployingWallet,
    private sdk: UniLoginSdk) {
    super(
      sdk.config.mineableFactoryTick,
      sdk.config.mineableFactoryTimeout,
      (hash: string) => sdk.relayerApi.getDeploymentStatus(hash),
    );
    this.contractAddress = serializedDeployingWallet.contractAddress;
    this.deploymentHash = serializedDeployingWallet.deploymentHash;
    this.name = serializedDeployingWallet.name;
    this.privateKey = serializedDeployingWallet.privateKey;
    this.email = serializedDeployingWallet.email;
  }

  waitForTransactionHash = () => this.createWaitForTransactionHash(this.deploymentHash)();

  waitToBeSuccess = async () => {
    await this.createWaitToBeSuccess(this.deploymentHash)();
    return this.email
      ? new DeployedWallet(this.contractAddress, this.name, this.privateKey, this.sdk, this.email)
      : new DeployedWithoutEmailWallet(this.contractAddress, this.name, this.privateKey, this.sdk);
  };
};

import {SerializedDeployingWallet} from '../..';
import {DeployedWallet} from './DeployedWallet';
import {MineableFactory} from '../../core/services/MineableFactory';
import UniversalLoginSDK from '../sdk';

export class DeployingWallet extends MineableFactory implements SerializedDeployingWallet {
  name: string;
  contractAddress: string;
  privateKey: string;
  deploymentHash: string;

  constructor(
    serializedDeployingWallet: SerializedDeployingWallet,
    private sdk: UniversalLoginSDK,
  ) {
    super(
      sdk.sdkConfig.mineableFactoryTick,
      sdk.sdkConfig.mineableFactoryTimeout,
      (hash: string) => sdk.relayerApi.getDeploymentStatus(hash),
    );
    this.contractAddress = serializedDeployingWallet.contractAddress;
    this.deploymentHash = serializedDeployingWallet.deploymentHash;
    this.name = serializedDeployingWallet.name;
    this.privateKey = serializedDeployingWallet.privateKey;
  }

  waitForTransactionHash = () => this.createWaitForTransactionHash(this.deploymentHash)();

  waitToBeSuccess = async () => {
    await this.createWaitToBeSuccess(this.deploymentHash)();
    return new DeployedWallet(this.contractAddress, this.name, this.privateKey, this.sdk);
  };
};

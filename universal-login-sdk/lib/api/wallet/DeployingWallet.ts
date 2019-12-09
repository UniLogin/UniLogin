import {DeploymentStatus} from '@universal-login/commons';
import {SerializedDeployingWallet} from '../..';
import {DeployedWallet} from './DeployedWallet';
import {MineableFactory} from '../../core/services/MineableFactory';
import UniversalLoginSDK from '../sdk';

type GetDeploymentStatus = (hash: string) => Promise<DeploymentStatus>

export class DeployingWallet extends MineableFactory implements SerializedDeployingWallet {
  public name: string;
  public contractAddress: string;
  public privateKey: string;
  public deploymentHash: string;

  constructor(
    serializedDeployingWallet: SerializedDeployingWallet,
    getDeploymentStatus: GetDeploymentStatus,
    private sdk: UniversalLoginSDK,
    tick?: number,
    timeout?: number) {
    super(
      tick,
      timeout,
      getDeploymentStatus,
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

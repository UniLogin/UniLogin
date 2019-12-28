import {BalanceDetails} from '../FutureWalletFactory';
import {SerializableFutureWallet, ensure, isValidEnsName, calculateInitializeSignature, SupportedToken} from '@universal-login/commons';
import {DeployingWallet} from './DeployingWallet';
import {DeploymentReadyObserver} from '../../core/observers/DeploymentReadyObserver';
import {InvalidAddressOrEnsName} from '../../core/utils/errors';
import UniversalLoginSDK from '../sdk';
import {utils} from 'ethers';
import {encodeInitializeWithENSData} from '@universal-login/contracts';
import {ENSService} from '../../integration/ethereum/ENSService';

export class FutureWallet implements SerializableFutureWallet {
  contractAddress: string;
  privateKey: string;
  readonly publicKey: string;
  deploymentReadyObserver: DeploymentReadyObserver;

  constructor(
    serializableFutureWallet: SerializableFutureWallet,
    private supportedTokens: SupportedToken[],
    private sdk: UniversalLoginSDK,
    private ensService: ENSService,
  ) {
    this.contractAddress = serializableFutureWallet.contractAddress;
    this.privateKey = serializableFutureWallet.privateKey;
    this.publicKey = utils.computeAddress(this.privateKey);
    this.deploymentReadyObserver = new DeploymentReadyObserver(this.supportedTokens, this.sdk.provider);
  }

  waitForBalance = async () => new Promise<BalanceDetails>(
    (resolve) => {
      this.deploymentReadyObserver.startAndSubscribe(
        this.contractAddress,
        (tokenAddress, contractAddress) => resolve({tokenAddress, contractAddress}),
      ).catch(console.error);
    },
  );

  deploy = async (ensName: string, gasPrice: string, gasToken: string): Promise<DeployingWallet> => {
    ensure(isValidEnsName(ensName), InvalidAddressOrEnsName, ensName);
    const initData = await this.setupInitData(this.publicKey, ensName, gasPrice, gasToken);
    const signature = await calculateInitializeSignature(initData, this.privateKey);
    const {deploymentHash} = await this.sdk.relayerApi.deploy(this.publicKey, ensName, gasPrice, gasToken, signature, this.sdk.sdkConfig.applicationInfo);
    return new DeployingWallet({deploymentHash, contractAddress: this.contractAddress, name: ensName, privateKey: this.privateKey}, this.sdk);
  };

  setSupportedToken = (supportedToken: SupportedToken) => {
    this.deploymentReadyObserver.setSupportedToken(supportedToken);
  };

  private async setupInitData(publicKey: string, ensName: string, gasPrice: string, gasToken: string) {
    const args = await this.ensService.argsFor(ensName) as string[];
    const initArgs = [publicKey, ...args, gasPrice, gasToken];
    return encodeInitializeWithENSData(initArgs);
  }
}

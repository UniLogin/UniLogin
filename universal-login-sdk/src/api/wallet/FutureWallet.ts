import {BalanceDetails} from '../FutureWalletFactory';
import {SerializableFutureWallet, ensure, isValidEnsName, calculateInitializeSignature, SupportedToken, DEPLOY_GAS_LIMIT} from '@universal-login/commons';
import {DeployingWallet} from './DeployingWallet';
import {DeploymentReadyObserver} from '../../core/observers/DeploymentReadyObserver';
import {InvalidAddressOrEnsName} from '../../core/utils/errors';
import UniversalLoginSDK from '../sdk';
import {utils} from 'ethers';
import {encodeDataForSetup} from '@universal-login/contracts';
import {ENSService} from '../../integration/ethereum/ENSService';
import {AddressZero} from 'ethers/constants';

export class FutureWallet implements SerializableFutureWallet {
  contractAddress: string;
  privateKey: string;
  readonly publicKey: string;
  deploymentReadyObserver: DeploymentReadyObserver;
  gasPrice: string;
  ensName: string;
  gasToken: string;

  constructor(
    serializableFutureWallet: SerializableFutureWallet,
    private sdk: UniversalLoginSDK,
    private ensService: ENSService,
    private relayerAddress: string,
  ) {
    this.contractAddress = serializableFutureWallet.contractAddress;
    this.privateKey = serializableFutureWallet.privateKey;
    this.publicKey = utils.computeAddress(this.privateKey);
    this.gasPrice = serializableFutureWallet.gasPrice;
    this.ensName = serializableFutureWallet.ensName;
    this.gasToken = serializableFutureWallet.gasToken;
    this.deploymentReadyObserver = new DeploymentReadyObserver([{address: this.gasToken, minimalAmount: this.getMinimalAmount()}], this.sdk.provider);
  }

  waitForBalance = async () => new Promise<BalanceDetails>(
    (resolve) => {
      this.deploymentReadyObserver.startAndSubscribe(
        this.contractAddress,
        (tokenAddress, contractAddress) => resolve({tokenAddress, contractAddress}),
      ).catch(console.error);
    },
  );

  deploy = async (): Promise<DeployingWallet> => {
    ensure(isValidEnsName(this.ensName), InvalidAddressOrEnsName, this.ensName);
    const initData = await FutureWallet.setupInitData(this.publicKey, this.ensName, this.gasPrice, this.gasToken, this.ensService, this.relayerAddress);
    const signature = await calculateInitializeSignature(initData, this.privateKey);
    const {deploymentHash} = await this.sdk.relayerApi.deploy(this.publicKey, this.ensName, this.gasPrice, this.gasToken, signature, this.sdk.sdkConfig.applicationInfo);
    return new DeployingWallet({deploymentHash, contractAddress: this.contractAddress, name: this.ensName, privateKey: this.privateKey}, this.sdk);
  };

  setSupportedToken = (supportedToken: SupportedToken) => {
    this.deploymentReadyObserver.setSupportedToken(supportedToken);
  };

  getMinimalAmount = () => utils.formatEther(utils.bigNumberify(this.gasPrice).mul(DEPLOY_GAS_LIMIT).toString());

  static async setupInitData(publicKey: string, ensName: string, gasPrice: string, gasToken: string, ensService: ENSService, relayerAddress: string) {
    const ensRegistrarData = await ensService.getRegistrarData(ensName);
    const deployment = {
      owners: [publicKey],
      requiredConfirmations: 1,
      deploymentCallAddress: ensService.ensRegistrarAddress,
      deploymentCallData: ensRegistrarData,
      fallbackHandler: AddressZero,
      paymentToken: gasToken,
      payment: utils.bigNumberify(gasPrice).mul(DEPLOY_GAS_LIMIT).toString(),
      refundReceiver: relayerAddress,
    };
    return encodeDataForSetup(deployment);
  }
}

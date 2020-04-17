import {BalanceDetails} from '../FutureWalletFactory';
import {SerializableFutureWallet, ensure, isValidEnsName, calculateInitializeSignature, SupportedToken, DEPLOY_GAS_LIMIT, multiplyBy150Percent} from '@unilogin/commons';
import {DeployingWallet} from './DeployingWallet';
import {DeploymentReadyObserver} from '../../core/observers/DeploymentReadyObserver';
import {InvalidAddressOrEnsName} from '../../core/utils/errors';
import UniversalLoginSDK from '../sdk';
import {utils} from 'ethers';
import {setupInitData} from '../../core/utils/setupInitData';
import {ENSService} from '../../integration/ethereum/ENSService';
import {IncomingTransactionObserver} from '../../integration/notifySdk/IncomingTransactionObserver';

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
    readonly sdk: UniversalLoginSDK,
    private ensService: ENSService,
    private relayerAddress: string,
    private fallbackHandlerAddress: string,
  ) {
    this.contractAddress = serializableFutureWallet.contractAddress;
    this.privateKey = serializableFutureWallet.privateKey;
    this.publicKey = utils.computeAddress(this.privateKey);
    this.gasPrice = '0';
    this.ensName = serializableFutureWallet.ensName;
    this.gasToken = serializableFutureWallet.gasToken;
    this.deploymentReadyObserver = new DeploymentReadyObserver([{address: this.gasToken, minimalAmount: this.getMinimalAmount()}], this.sdk.provider);
  }

  waitForBalance = () => new Promise<BalanceDetails>(
    (resolve) => {
      try {
        this.deploymentReadyObserver.startAndSubscribe(
          this.contractAddress,
          (tokenAddress, contractAddress) => resolve({tokenAddress, contractAddress}),
        );
      } catch (e) {
        console.error(e);
      };
    },
  );

  deploy = async (): Promise<DeployingWallet> => {
    ensure(isValidEnsName(this.ensName), InvalidAddressOrEnsName, this.ensName);
    const initData = await setupInitData({publicKey: this.publicKey, ensName: this.ensName, gasPrice: this.gasPrice, gasToken: this.gasToken, ensService: this.ensService, relayerAddress: this.relayerAddress, fallbackHandler: this.fallbackHandlerAddress});
    const signature = calculateInitializeSignature(initData, this.privateKey);
    const {deploymentHash} = await this.sdk.relayerApi.deploy(this.publicKey, this.ensName, this.gasPrice, this.gasToken, signature, this.sdk.config.applicationInfo, this.contractAddress);
    return new DeployingWallet({deploymentHash, contractAddress: this.contractAddress, name: this.ensName, privateKey: this.privateKey}, this.sdk);
  };

  setSupportedToken = (supportedToken: SupportedToken) => {
    this.deploymentReadyObserver.setSupportedToken(supportedToken);
  };

  getMinimalAmount = () => utils.formatEther(
    multiplyBy150Percent(
      utils.bigNumberify(this.gasPrice).mul(DEPLOY_GAS_LIMIT)));

  createIncomingTransactionObserver() {
    return new IncomingTransactionObserver(this.sdk.getNotifySdk(), this.contractAddress);
  }
}

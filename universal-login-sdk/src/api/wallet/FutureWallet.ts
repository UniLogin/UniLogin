import {SerializableFutureWallet, ensure, isValidEnsName, calculateInitializeSignature, DEPLOY_GAS_LIMIT, multiplyBy150Percent, BalanceChecker} from '@unilogin/commons';
import {DeployingWallet} from './DeployingWallet';
import {DeploymentReadyObserver} from '../../core/observers/DeploymentReadyObserver';
import {InvalidAddressOrEnsName} from '../../core/utils/errors';
import UniLoginSdk from '../sdk';
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
    readonly sdk: UniLoginSdk,
    private ensService: ENSService,
    private relayerAddress: string,
    private fallbackHandlerAddress: string,
    balanceChecker: BalanceChecker,
  ) {
    this.contractAddress = serializableFutureWallet.contractAddress;
    this.privateKey = serializableFutureWallet.privateKey;
    this.publicKey = utils.computeAddress(this.privateKey);
    this.gasPrice = serializableFutureWallet.gasPrice;
    this.ensName = serializableFutureWallet.ensName;
    this.gasToken = serializableFutureWallet.gasToken;
    this.deploymentReadyObserver = new DeploymentReadyObserver(this.gasToken, this.getMinimalAmount(), balanceChecker);
  }

  waitForBalance = () => new Promise<string>(
    (resolve) => {
      try {
        this.deploymentReadyObserver.startAndSubscribe(
          this.contractAddress,
          (contractAddress) => resolve(contractAddress),
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

  getMinimalAmount = () => utils.formatEther(
    multiplyBy150Percent(
      utils.bigNumberify(this.gasPrice).mul(DEPLOY_GAS_LIMIT)));

  createIncomingTransactionObserver() {
    return new IncomingTransactionObserver(this.sdk.getNotifySdk(), this.contractAddress);
  }

  getTopUpCurrencySymbol = () => this.sdk.tokensDetailsStore.getTokenBy('address', this.gasToken).symbol;
}

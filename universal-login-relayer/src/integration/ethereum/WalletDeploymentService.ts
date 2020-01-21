import {EventEmitter} from 'fbemitter';
import {utils} from 'ethers';
import {ensure, RequiredBalanceChecker, DeployArgs, getInitializeSigner, DEPLOY_GAS_LIMIT, DeviceInfo, SupportedToken, safeMultiply, MINIMAL_DEPLOYMENT_GAS_LIMIT} from '@universal-login/commons';
import {computeGnosisCounterfactualAddress, encodeDataForSetup, gnosisSafe} from '@universal-login/contracts';
import ENSService from './ensService';
import {NotEnoughBalance, InvalidSignature, NotEnoughGas} from '../../core/utils/errors';
import {Config} from '../../config/relayer';
import {WalletDeployer} from './WalletDeployer';
import {DevicesService} from '../../core/services/DevicesService';
import {AddressZero} from 'ethers/constants';

export class WalletDeploymentService {
  private readonly supportedTokens: SupportedToken[] = this.config.supportedTokens;

  constructor(
    private config: Config,
    private ensService: ENSService,
    private hooks: EventEmitter,
    private walletDeployer: WalletDeployer,
    private requiredBalanceChecker: RequiredBalanceChecker,
    private devicesService: DevicesService) {
  }

  async setupInitializeData({publicKey, ensName, gasPrice, gasToken}: Omit<DeployArgs, 'signature'>) {
    const ensArgs = await this.ensService.argsFor(ensName);
    const deployment = {owners: [publicKey],
      requiredConfirmations: 1,
      deploymentCallAddress: this.config.ensRegistrar,
      deploymentCallData: new utils.Interface(gnosisSafe.ENSRegistrar.interface as any).functions.register.encode(ensArgs),
      fallbackHandler: AddressZero,
      paymentToken: gasToken,
      payment: utils.bigNumberify(gasPrice).mul(DEPLOY_GAS_LIMIT).toString(),
      refundReceiver: this.walletDeployer.wallet.address,
    };
    return encodeDataForSetup(deployment as any);
  }

  private async computeFutureAddress(setupData: string) {
    return computeGnosisCounterfactualAddress(this.config.factoryAddress, 1, setupData, this.config.walletContractAddress);
  }

  async deploy({publicKey, ensName, gasPrice, gasToken, signature}: DeployArgs, deviceInfo: DeviceInfo) {
    const initWithENS = await this.setupInitializeData({publicKey, ensName, gasPrice, gasToken});
    ensure(getInitializeSigner(initWithENS, signature) === publicKey, InvalidSignature);
    ensure(utils.bigNumberify(gasPrice).gt(0), NotEnoughGas);
    const contractAddress = await this.computeFutureAddress(initWithENS);
    const supportedTokens = this.getTokensWithMinimalAmount(gasPrice);
    ensure(!!await this.requiredBalanceChecker.findTokenWithRequiredBalance(supportedTokens, contractAddress), NotEnoughBalance);
    const transaction = await this.walletDeployer.deploy(this.config.walletContractAddress, initWithENS, '1', {gasLimit: DEPLOY_GAS_LIMIT, gasPrice: utils.bigNumberify(gasPrice)});
    await this.devicesService.addOrUpdate(contractAddress, publicKey, deviceInfo);
    this.hooks.emit('created', {transaction, contractAddress});
    return transaction;
  }

  getTokensWithMinimalAmount(gasPrice: string) {
    return this.supportedTokens.map((supportedToken) =>
      ({...supportedToken, minimalAmount: safeMultiply(MINIMAL_DEPLOYMENT_GAS_LIMIT, gasPrice)}));
  }
}

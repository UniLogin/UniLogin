import {EventEmitter} from 'fbemitter';
import {utils} from 'ethers';
import {ensure, RequiredBalanceChecker, DeployArgs, getInitializeSigner, DEPLOY_GAS_LIMIT, DeviceInfo} from '@universal-login/commons';
import {encodeInitializeWithENSData} from '@universal-login/contracts';
import ENSService from './ensService';
import {NotEnoughBalance, InvalidSignature, NotEnoughGas} from '../../core/utils/errors';
import {Config} from '../../config/relayer';
import {WalletDeployer} from './WalletDeployer';
import {DevicesService} from '../../core/services/DevicesService';

class WalletService {
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
    const args = [publicKey, ...ensArgs as string[], gasPrice, gasToken];
    return encodeInitializeWithENSData(args);
  }

  async deploy({publicKey, ensName, gasPrice, gasToken, signature}: DeployArgs, deviceInfo: DeviceInfo) {
    ensure(utils.bigNumberify(gasPrice).gt(0), NotEnoughGas);
    const contractAddress = await this.walletDeployer.computeFutureAddress(publicKey);
    ensure(!!await this.requiredBalanceChecker.findTokenWithRequiredBalance(this.config.supportedTokens, contractAddress), NotEnoughBalance);
    const initWithENS = await this.setupInitializeData({publicKey, ensName, gasPrice, gasToken});
    ensure(getInitializeSigner(initWithENS, signature) === publicKey, InvalidSignature);
    const transaction = await this.walletDeployer.deploy({publicKey, signature, intializeData: initWithENS}, {gasLimit: DEPLOY_GAS_LIMIT, gasPrice: utils.bigNumberify(gasPrice)});
    await this.devicesService.addOrUpdate(contractAddress, publicKey, deviceInfo);
    this.hooks.emit('created', {transaction, contractAddress});
    return transaction;
  }
}

export default WalletService;

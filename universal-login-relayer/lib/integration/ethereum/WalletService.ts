import {EventEmitter} from 'fbemitter';
import {utils} from 'ethers';
import {ensureNotNull, ensure, RequiredBalanceChecker, computeContractAddress, DeployArgs, getInitializeSigner, DEPLOY_GAS_LIMIT} from '@universal-login/commons';
import {encodeInitializeWithENSData} from '@universal-login/contracts';
import ENSService from './ensService';
import {InvalidENSDomain, NotEnoughBalance, EnsNameTaken, InvalidSignature} from '../../core/utils/errors';
import {Config} from '../../config/relayer';
import {WalletDeployer} from '../ethereum/WalletDeployer';

class WalletService {

  constructor(private config: Config, private ensService: ENSService, private hooks: EventEmitter, private walletDeployer: WalletDeployer, private requiredBalanceChecker: RequiredBalanceChecker) {
  }

  async deploy({publicKey, ensName, gasPrice, gasToken, signature}: DeployArgs) {
    ensure(!await this.ensService.resolveName(ensName), EnsNameTaken, ensName);
    const ensArgs = this.ensService.argsFor(ensName);
    ensureNotNull(ensArgs, InvalidENSDomain, ensName);
    const contractAddress = computeContractAddress(this.config.factoryAddress, publicKey, await this.walletDeployer.getInitCode());
    ensure(!!await this.requiredBalanceChecker.findTokenWithRequiredBalance(this.config.supportedTokens, contractAddress), NotEnoughBalance);
    const args = [publicKey, ...ensArgs as string[], gasPrice, gasToken];
    const initWithENS = encodeInitializeWithENSData(args);
    ensure(getInitializeSigner(initWithENS, signature) === publicKey, InvalidSignature);
    const transaction = await this.walletDeployer.deploy({publicKey, signature, intializeData: initWithENS}, {gasLimit: DEPLOY_GAS_LIMIT, gasPrice: utils.bigNumberify(gasPrice)});
    this.hooks.emit('created', {transaction, contractAddress});
    return transaction;
  }
}

export default WalletService;

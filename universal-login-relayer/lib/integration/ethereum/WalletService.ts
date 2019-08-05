import {ContractFactory, Wallet, utils} from 'ethers';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import ENSService from './ensService';
import {EventEmitter} from 'fbemitter';
import {Abi, defaultDeployOptions, ensureNotNull, ensure, BalanceChecker, RequiredBalanceChecker, computeContractAddress, DeployArgs, getInitializeSigner, DEPLOY_GAS_LIMIT} from '@universal-login/commons';
import {InvalidENSDomain, NotEnoughBalance, EnsNameTaken, InvalidSignature} from '../../core/utils/errors';
import {encodeInitializeWithENSData, encodeInitializeWithRefundData} from '@universal-login/contracts';
import {Config} from '../../config/relayer';
import {WalletDeployer} from '../ethereum/WalletDeployer';

class WalletService {
  private bytecode: string;
  private abi: Abi;

  constructor(private wallet: Wallet, private config: Config, private ensService: ENSService, private hooks: EventEmitter, private walletDeployer: WalletDeployer, private requiredBalanceChecker: RequiredBalanceChecker) {
    const contractJSON = ProxyContract;
    this.abi = contractJSON.interface;
    this.bytecode = `0x${contractJSON.evm.bytecode.object}`;
  }

  async create(key: string, ensName: string, overrideOptions = {}) {
    const ensArgs = this.ensService.argsFor(ensName);
    if (ensArgs !== null) {
      let args = [key, ...ensArgs] as string[];
      const initData = encodeInitializeWithENSData(args);
      args = [this.config.walletMasterAddress, initData];
      const deployTransaction = {
        ...defaultDeployOptions,
        ...overrideOptions,
        ...new ContractFactory(this.abi, this.bytecode).getDeployTransaction(...args),
      };
      const transaction = await this.wallet.sendTransaction(deployTransaction);
      this.hooks.emit('created', transaction);
      return transaction;
    }
    throw new InvalidENSDomain(ensName);
  }

  async deploy({publicKey, ensName, gasPrice, signature}: DeployArgs) {
    ensure(!await this.ensService.resolveName(ensName), EnsNameTaken, ensName);
    const ensArgs = this.ensService.argsFor(ensName);
    ensureNotNull(ensArgs, InvalidENSDomain, ensName);
    const contractAddress = computeContractAddress(this.config.factoryAddress, publicKey, await this.walletDeployer.getInitCode());
    ensure(!!await this.requiredBalanceChecker.findTokenWithRequiredBalance(this.config.supportedTokens, contractAddress), NotEnoughBalance);
    const args = [publicKey, ...ensArgs as string[], gasPrice];
    const initWithENS = encodeInitializeWithRefundData(args);
    ensure(getInitializeSigner(initWithENS, signature) === publicKey, InvalidSignature);
    return this.walletDeployer.deploy({publicKey, signature, intializeData: initWithENS}, {gasLimit: DEPLOY_GAS_LIMIT, gasPrice: utils.bigNumberify(gasPrice)});
  }
}

export default WalletService;

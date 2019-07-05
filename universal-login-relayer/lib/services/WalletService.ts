import {ContractFactory, Wallet, Contract, utils} from 'ethers';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import ProxyCounterfactualFactory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';
import ENSService from './ensService';
import {EventEmitter} from 'fbemitter';
import {Abi, defaultDeployOptions, ensureNotNull, ensure, findTokenWithRequiredBalance, computeContractAddress} from '@universal-login/commons';
import {InvalidENSDomain, NotEnoughBalance, EnsNameTaken} from '../utils/errors';
import {encodeInitializeWithENSData, encodeInitializeWithRefundData} from '@universal-login/contracts';
import {Config} from '../config/relayer';

class WalletService {
  private bytecode: string;
  private abi: Abi;
  private factoryContract?: Contract;

  constructor(private wallet: Wallet, private config: Config, private ensService: ENSService, private hooks: EventEmitter) {
    const contractJSON = ProxyContract;
    this.abi = contractJSON.interface;
    this.bytecode = `0x${contractJSON.evm.bytecode.object}`;
    if (this.config.factoryAddress) {
      this.factoryContract = new Contract(this.config.factoryAddress, ProxyCounterfactualFactory.interface, this.wallet);
    }
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

  async deploy(key: string, ensName: string, gasPrice: string) {
    ensure(!await this.ensService.resolveName(ensName), EnsNameTaken, ensName);
    const ensArgs = this.ensService.argsFor(ensName);
    ensureNotNull(ensArgs, InvalidENSDomain, ensName);
    const contractAddress = computeContractAddress(this.config.factoryAddress, key, await this.factoryContract!.initCode());
    ensure(!!await findTokenWithRequiredBalance(this.wallet.provider, this.config.supportedTokens, contractAddress), NotEnoughBalance);
    const args = [key, ...ensArgs as string[], this.wallet.address, gasPrice];
    const initWithENS = encodeInitializeWithRefundData(args);
    return this.factoryContract!.createContract(key, initWithENS, {...defaultDeployOptions, gasPrice: utils.bigNumberify(gasPrice)});
  }
}

export default WalletService;

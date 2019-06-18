import {ContractFactory, Wallet, Contract} from 'ethers';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import ProxyCounterfactualFactory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';
import ENSService from './ensService';
import {EventEmitter} from 'fbemitter';
import {Abi, defaultDeployOptions, ensureNotNull} from '@universal-login/commons';
import {InvalidENSDomain} from '../utils/errors';
import {encodeInitializeWithENSData} from '@universal-login/contracts';

class WalletService {
  private bytecode: string;
  private abi: Abi;
  private factoryContract: Contract;

  constructor(private wallet: Wallet, private walletMasterAddress: string, private ensService: ENSService, private hooks: EventEmitter, factoryAddress: string) {
    const contractJSON = ProxyContract;
    this.abi = contractJSON.interface;
    this.bytecode = `0x${contractJSON.evm.bytecode.object}`;
    this.factoryContract = new Contract(factoryAddress, ProxyCounterfactualFactory.interface, this.wallet);
  }

  async create(key: string, ensName: string, overrideOptions = {}) {
    const ensArgs = this.ensService.argsFor(ensName);
    if (ensArgs !== null) {
      let args = [key, ...ensArgs] as string[];
      const initData = encodeInitializeWithENSData(args);
      args = [this.walletMasterAddress, initData];
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

  async deploy(key: string, ensName: string) {
    const ensArgs = this.ensService.argsFor(ensName);
    ensureNotNull(ensArgs, InvalidENSDomain, ensName);
    const args = [key, ...ensArgs as string[]];
    const initWithENS = encodeInitializeWithENSData(args);
    return this.factoryContract.createContract(key, initWithENS, {...defaultDeployOptions});
  }
}

export default WalletService;

import {ContractFactory, Wallet} from 'ethers';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import {EnsArgs} from './EnsArgs';
import {EventEmitter} from 'fbemitter';
import {Abi, defaultDeployOptions} from '@universal-login/commons';
import {InvalidENSDomain} from '../utils/errors';
import {encodeInitializeWithENSData} from '@universal-login/contracts';

class WalletService {
  private bytecode: string;
  private abi: Abi;

  constructor(private wallet: Wallet, private walletMasterAddress: string, private ensArgsFor: EnsArgs, private hooks: EventEmitter) {
    const contractJSON = ProxyContract;
    this.abi = contractJSON.interface;
    this.bytecode = `0x${contractJSON.evm.bytecode.object}`;
  }

  async create(key: string, ensName: string, overrideOptions = {}) {
    const ensArgs = this.ensArgsFor(ensName);
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
}

export default WalletService;

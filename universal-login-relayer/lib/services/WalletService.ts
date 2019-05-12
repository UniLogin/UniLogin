import {utils, ContractFactory, Wallet} from 'ethers';
import WalletMasterContract from '@universal-login/contracts/build/WalletMaster.json';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import LegacyWallet from '@universal-login/contracts/build/LegacyWallet.json';
import ENSService from './ensService';
import {EventEmitter} from 'fbemitter';
import {Abi, defaultDeployOptions} from '@universal-login/commons';
import {InvalidENSDomain} from '../utils/errors';

class WalletService {
  private bytecode: string;
  private abi: Abi;
  private readonly useInitData: boolean;

  constructor(private wallet: Wallet, private walletMasterAddress: string, private ensService: ENSService, private hooks: EventEmitter, legacyENS : boolean) {
    const contractJSON = legacyENS ? LegacyWallet : ProxyContract;
    this.abi = contractJSON.interface;
    this.bytecode = `0x${contractJSON.evm.bytecode.object}`;
    this.useInitData = !legacyENS;
  }

  async create(key: string, ensName: string, overrideOptions = {}) {
    const ensArgs = this.ensService.argsFor(ensName);
    if (ensArgs !== null) {
      let args = [key, ...ensArgs];
      if (this.useInitData) {
        const initData = new utils.Interface(WalletMasterContract.interface).functions.initializeWithENS.encode(args);
        args = [ this.walletMasterAddress, initData ];
      }
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

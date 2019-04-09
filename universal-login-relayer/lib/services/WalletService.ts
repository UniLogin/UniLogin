import {utils, ContractFactory, Wallet, providers} from 'ethers';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import WalletMasterContract from '@universal-login/contracts/build/WalletMaster.json';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import LegacyWallet from '@universal-login/contracts/build/LegacyWallet.json';
import {hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall} from '../utils/utils';
import defaultDeployOptions from '../config/defaultDeployOptions';
import ENSService from './ensService';
import AuthorisationService from './authorisationService';
import {EventEmitter} from 'fbemitter';
import {ContractJSON, Abi, Message} from '@universal-login/commons';
import {BigNumberish} from 'ethers/utils';

class WalletService {
  private codec: utils.AbiCoder;
  private bytecode: string;
  private abi: Abi;
  private contractJSON: ContractJSON;
  private readonly useInitData: boolean;

  constructor(private wallet: Wallet, private walletMasterAddress: string, private ensService: ENSService, private authorisationService: AuthorisationService, private hooks: EventEmitter, private provider: providers.Provider, private legacyENS : boolean) {
    this.contractJSON = legacyENS ? LegacyWallet : ProxyContract;
    this.abi = this.contractJSON.interface;
    this.bytecode = `0x${this.contractJSON.evm.bytecode.object}`;
    this.codec = new utils.AbiCoder();
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
    throw new Error('domain not existing / not universal ID compatible');
  }

  async executeSigned(message: Message) {
    if (await hasEnoughToken(message.gasToken, message.from, message.gasLimit, this.provider)) {
      const data = new utils.Interface(WalletContract.interface).functions.executeSigned.encode([message.to, message.value, message.data, message.nonce, message.gasPrice, message.gasToken, message.gasLimit, message.operationType, message.signature]);
      const transaction = {
        ...defaultDeployOptions,
        value: utils.parseEther('0'),
        to: message.from,
        data,
      };
      const estimateGas = await this.provider.estimateGas({...transaction, from: this.wallet.address});
      if (utils.bigNumberify(message.gasLimit as BigNumberish).gte(estimateGas)) {
        if (message.to === message.from && isAddKeyCall(message.data as string)) {
          const key = getKeyFromData(message.data as string);
          await this.authorisationService.removeRequest(message.from, key);
          const sentTransaction = await this.wallet.sendTransaction(transaction);
          this.hooks.emit('added', sentTransaction);
          return sentTransaction;
        } else if (message.to === message.from && isAddKeysCall(message.data as string)) {
          const sentTransaction = await this.wallet.sendTransaction(transaction);
          this.hooks.emit('keysAdded', sentTransaction);
          return sentTransaction;
        }
        return this.wallet.sendTransaction(transaction);
      }
    }
    throw new Error('Not enough tokens');
  }
}

export default WalletService;

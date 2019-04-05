const WalletContract = require('universal-login-contracts/build/Wallet');
const WalletMasterContract = require('universal-login-contracts/build/WalletMaster');
const ProxyContract = require('universal-login-contracts/build/Proxy');
const LegacyWallet = require('universal-login-contracts/build/LegacyWallet');
import {hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall} from '../utils/utils';
import {utils, ContractFactory, Wallet, providers} from 'ethers';
import defaultDeployOptions from '../config/defaultDeployOptions';
import ENSService from './ensService';
import AuthorisationService from './authorisationService';
import {EventEmitter} from 'fbemitter';

declare interface Message {
  to: string;
  from: string;
  value: string;
  data: string;
  nonce: number;
  gasPrice: string;
  gasToken: string;
  gasLimit: string;
  operationType: number;
  signature: string;
}

class WalletService {
  private codec: utils.AbiCoder;
  private bytecode: string;
  private abi: utils.Interface;
  private contractJSON: ContractFactory;
  private useInitData: boolean;

  constructor(private wallet: Wallet, private walletMasterAddress: string, private ensService: ENSService, private authorisationService: AuthorisationService, private hooks: EventEmitter, private provider: providers.Provider, private legacyENS : boolean) {
    this.contractJSON = legacyENS ? LegacyWallet : ProxyContract;
    this.abi = this.contractJSON.interface;
    this.bytecode = `0x${this.contractJSON.bytecode}`;
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
      if (utils.bigNumberify(message.gasLimit).gte(estimateGas)) {
        if (message.to === message.from && isAddKeyCall(message.data)) {
          const key = getKeyFromData(message.data);
          await this.authorisationService.removeRequest(message.from, key);
          const sentTransaction = await this.wallet.sendTransaction(transaction);
          this.hooks.emit('added', sentTransaction);
          return sentTransaction;
        } else if (message.to === message.from && isAddKeysCall(message.data)) {
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

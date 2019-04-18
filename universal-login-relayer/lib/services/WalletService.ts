import {utils, ContractFactory, Wallet, providers} from 'ethers';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import WalletMasterContract from '@universal-login/contracts/build/WalletMaster.json';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import LegacyWallet from '@universal-login/contracts/build/LegacyWallet.json';
import {calculateMessageHash} from '@universal-login/contracts';
import {hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall, sortExecutionsByKey, getRequiredSignatures} from '../utils/utils';
import PendingExecution from '../utils/pendingExecution';
import defaultDeployOptions from '../config/defaultDeployOptions';
import ENSService from './ensService';
import AuthorisationService from './authorisationService';
import {EventEmitter} from 'fbemitter';
import {ContractJSON, Abi, Message, defaultDeployOptions} from '@universal-login/commons';

class WalletService {
  private codec: utils.AbiCoder;
  private bytecode: string;
  private abi: Abi;
  private contractJSON: ContractJSON;
  public pendingExecutions: Record<string, PendingExecution>;
  private readonly useInitData: boolean;

  constructor(private wallet: Wallet, private walletMasterAddress: string, private ensService: ENSService, private authorisationService: AuthorisationService, private hooks: EventEmitter, private provider: providers.Provider, private legacyENS : boolean) {
    this.contractJSON = legacyENS ? LegacyWallet : ProxyContract;
    this.abi = this.contractJSON.interface;
    this.bytecode = `0x${this.contractJSON.evm.bytecode.object}`;
    this.codec = new utils.AbiCoder();
    this.useInitData = !legacyENS;
    this.pendingExecutions = {};
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
    const requiredSignatures = await getRequiredSignatures(message.from, this.wallet);
    if (requiredSignatures > 1) {
      const hash = await calculateMessageHash(message);
      if (hash in this.pendingExecutions) {
        await this.pendingExecutions[hash].push(message);
        if (this.pendingExecutions[hash].canExecute()) {
            return this.executePending(hash, message);
        }
        return JSON.stringify(this.pendingExecutions[hash].getStatus());
      } else {
        return this.createPending(hash, message);
      }
    } else {
      return this.execute(message);
    }
  }

  async executePending(hash: string, message: Message) {
      const finalMessage = {...message, signature: this.pendingExecutions[hash].getConcatenatedSignatures()};
      const transaction: any = await this.execute(finalMessage);
      await this.pendingExecutions[hash].confirmExecution(transaction.hash);
      return transaction;
  }

  async createPending(hash: string, message: Message) {
      const walletContract: any = message.from;
      this.pendingExecutions[hash] = new PendingExecution(walletContract, this.wallet);
      await this.pendingExecutions[hash].push(message);
      return JSON.stringify(await this.pendingExecutions[hash].getStatus());
  }

  async execute(message: Message) {
    if (await hasEnoughToken(message.gasToken, message.from, message.gasLimit, this.provider)) {
      const data = new utils.Interface(WalletContract.interface).functions.executeSigned.encode([message.to, message.value, message.data, message.nonce, message.gasPrice, message.gasToken, message.gasLimit, message.operationType, message.signature]);
      const transaction = {
        ...defaultDeployOptions,
        value: utils.parseEther('0'),
        to: message.from,
        data,
      };
      const estimateGas = await this.provider.estimateGas({...transaction, from: this.wallet.address});
      if (utils.bigNumberify(message.gasLimit as utils.BigNumberish).gte(estimateGas)) {
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

  async getStatus(hash: string) {
    if (!(hash in this.pendingExecutions)) {
      throw 'Unable to find execution with given message hash';
    }
    return this.pendingExecutions[hash].getStatus();
  }
}

export default WalletService;

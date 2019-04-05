import ProxyContract from 'universal-login-contracts/build/Proxy';
import WalletContract from 'universal-login-contracts/build/Wallet';
import WalletMasterContract from 'universal-login-contracts/build/WalletMaster';
import LegacyWallet from 'universal-login-contracts/build/LegacyWallet';
import {hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall, sortExecutionsByKey, getRequiredSignatures} from '../utils/utils';
import {utils, Contract, ContractFactory} from 'ethers';
import defaultDeployOptions from '../config/defaultDeployOptions';
import {concatenateSignatures, calculateMessageHash} from 'universal-login-contracts';
import PendingExecution from '../utils/pendingExecution';

class WalletService {
  constructor(wallet, walletMasterAddress, ensService, authorisationService, hooks, provider, legacyENS) {
    this.wallet = wallet;
    this.contractJSON = legacyENS ? LegacyWallet : ProxyContract;
    this.abi = this.contractJSON.interface;
    this.bytecode = `0x${this.contractJSON.bytecode}`;
    this.walletMasterAddress = walletMasterAddress;
    this.ensService = ensService;
    this.authorisationService = authorisationService;
    this.codec = new utils.AbiCoder();
    this.hooks = hooks;
    this.provider = provider;
    this.pendingExecutions = {};
    this.useInitData = !legacyENS;
  }

  async create(key, ensName, overrideOptions = {}) {
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

  async executeSigned(message) {
    const requiredSignatures = await getRequiredSignatures(message.from, this.wallet);
    if (requiredSignatures > 1) {
      const hash = await calculateMessageHash(message);
      if (this.pendingExecutions[hash] !== undefined) {
        await this.pendingExecutions[hash].push(message);
        if (this.pendingExecutions[hash].canExecute()) {
          const finalMessage = {...message, signature: this.pendingExecutions[hash].getConcatenatedSignatures()};
          const transaction = await this.execute(finalMessage);
          await this.pendingExecutions[hash].confirmExecution(transaction.hash);
          return transaction;
        }
        return JSON.stringify(this.pendingExecutions[hash].getStatus());
      } else {
        this.pendingExecutions[hash] = new PendingExecution(message.from, this.wallet);
        await this.pendingExecutions[hash].push(message);
        return JSON.stringify(await this.pendingExecutions[hash].getStatus());
      }
    } else {
      return this.execute(message);
    }
  }

  async getStatus(hash) {
    if (!this.pendingExecutions[hash]) {
      throw new Error('Unable to find execution with given message hash');
    }
    return this.pendingExecutions[hash].getStatus();
  }

  async execute(message) {
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

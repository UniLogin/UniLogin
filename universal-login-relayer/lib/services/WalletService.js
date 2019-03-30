import WalletContract from 'universal-login-contracts/build/WalletContract';
import LegacyWallet from 'universal-login-contracts/build/LegacyWallet';
import {hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall, sortExecutionsByKey} from '../utils/utils';
import {utils, ContractFactory, Contract} from 'ethers';
import defaultDeployOptions from '../config/defaultDeployOptions';
import {concatenateSignatures, calculateMessageHash} from 'universal-login-contracts';

class PendingExecution {

  constructor(walletAddress, wallet) {
    this.Wallet = wallet;
    this.WalletContract = new Contract(walletAddress, WalletContract.interface, this.Wallet);
    this.CollectedSignatures = [];
  }

  async getStatus() {
    return {
      collectedSignatures: this.CollectedSignatures,
      totalCollected: this.CollectedSignatures.length,
      required: await this.WalletContract.requiredSignatures()
    };
  }

  async push(from, to, value, data, nonce, gasPrice, gasToken, gasLimit, operationType, signature) {
    if (collectedSignatures.includes(signature)) {
      throw 'signature already collected';
    }
    const key = await this.WalletContract.getSigner(from, to, value, data, nonce, gasPrice, gasToken, gasLimit, operationType, signature);
    if (await this.WalletContract.getKeyPurpose(key) === 0) {
      throw 'invalid signature';
    }
    collectedSignatures.push({signature, key});
  }

  async canExecute() {
    return collectedSignatures.length >= await this.WalletContract.requiredSignatures();
  }

  getConcatenatedSignatures() {
    const sortedExecutions = sortExecutionsByKey(this.collectedSignatures);
    const sortedSignatures = sortedExecutions.map((value) => value.signature);
    return concatenateSignatures(sortedSignatures);
  }
}

class WalletService {

  constructor(wallet, ensService, authorisationService, hooks, provider, legacyENS) {
    this.wallet = wallet;
    this.contractJSON = legacyENS ? LegacyWallet : WalletContract;
    this.abi = this.contractJSON.interface;
    this.bytecode = `0x${this.contractJSON.bytecode}`;
    this.ensService = ensService;
    this.authorisationService = authorisationService;
    this.codec = new utils.AbiCoder();
    this.hooks = hooks;
    this.provider = provider;
    this.pendingExecutions = new Object();
  }

  async create(key, ensName, overrideOptions = {}) {
    const ensArgs = this.ensService.argsFor(ensName);
    if (ensArgs !== null) {
      const args = [key, ...ensArgs];
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
    const walletContract = new Contract(message.from, WalletContract.interface, this.wallet);

    if (await walletContract.requiredSignatures() > 1) {
      const hash = await calculateMessageHash(message);
      if (pendingExecutions[hash] !== undefined) {
        await pendingExecutions[hash].push(message.signature);
        if (pendingExecutions[hash].canExecute()) {
          const finalMessage = {...message, signature: pendingExecutions[hash].getConcatenatedSignatures()};
          return this.execute(finalMessage);
        }
        return JSON.stringify(pendingExecutions[hash].getStatus());
      } else {
        pendingExecutions[hash] = new PendingExecution(message.from, this.wallet);
        await pendingExecutions[hash].push(message.signature);
        return JSON.stringify(await pendingExecutions[hash].getStatus());
      }
    } else {
      return this.execute(message);
    }
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

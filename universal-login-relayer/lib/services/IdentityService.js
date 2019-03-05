import Identity from 'universal-login-contracts/build/Identity';
import IdentityLegacy from 'universal-login-contracts/build/IdentityLegacy';
import {hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall} from '../utils/utils';
import {utils, ContractFactory} from 'ethers';
import defaultDeployOptions from '../config/defaultDeployOptions';


class IdentityService {
  constructor(wallet, ensService, authorisationService, hooks, provider, legacyENS) {
    this.wallet = wallet;
    this.contractJSON = legacyENS ? IdentityLegacy : Identity;
    this.abi = this.contractJSON.interface;
    this.bytecode = `0x${this.contractJSON.bytecode}`;
    this.ensService = ensService;
    this.authorisationService = authorisationService;
    this.codec = new utils.AbiCoder();
    this.hooks = hooks;
    this.provider = provider;
  }

  async create(managementKey, ensName, overrideOptions = {}) {
    const key = managementKey;
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
    if (await hasEnoughToken(message.gasToken, message.from, message.gasLimit, this.provider)) {
      const data = new utils.Interface(Identity.interface).functions.executeSigned.encode([message.to, message.value, message.data, message.nonce, message.gasPrice, message.gasToken, message.gasLimit, message.operationType, message.signature]);
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

export default IdentityService;

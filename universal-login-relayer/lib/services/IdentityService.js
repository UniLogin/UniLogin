import Identity from 'universal-login-contracts/build/Identity';
import {addressToBytes32, hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall} from '../utils/utils';
import ethers, {utils, Interface} from 'ethers';
import defaultDeployOptions from '../config/defaultDeployOptions';


class IdentityService {
  constructor(wallet, ensService, authorisationService, hooks, provider) {
    this.wallet = wallet;
    this.abi = Identity.interface;
    this.ensService = ensService;
    this.authorisationService = authorisationService;
    this.codec = new utils.AbiCoder();
    this.hooks = hooks;
    this.provider = provider;
  }

  async create(managementKey, ensName, overrideOptions = {}) {
    const key = addressToBytes32(managementKey);
    const bytecode = `0x${Identity.bytecode}`;
    const ensArgs = this.ensService.argsFor(ensName);
    if (ensArgs !== null) {
      const args = [key, ...ensArgs];
      const deployTransaction = {
        ...defaultDeployOptions,
        ...overrideOptions,
        ...ethers.Contract.getDeployTransaction(bytecode, this.abi, ...args)
      };
      const transaction = await this.wallet.sendTransaction(deployTransaction);
      this.hooks.emit('created', transaction);
      return transaction;
    }
    throw new Error('domain not existing / not universal ID compatible');
  }

  async executeSigned(contractAddress, message) {
    if (await hasEnoughToken(message.gasToken, contractAddress, message.gasLimit, this.provider)) {
      const {data} = new Interface(Identity.interface).functions.executeSigned(message.to, message.value, message.data, message.nonce, message.gasPrice, message.gasToken, message.gasLimit, message.operationType, message.signature);
      const transaction = {
        value: 0,
        to: contractAddress,
        data,
        ...defaultDeployOptions
      };
      const estimateGas = await this.wallet.estimateGas(transaction);
      if (message.gasLimit >= estimateGas) {
        if (message.to === contractAddress && isAddKeyCall(message.data)) {
          const key = getKeyFromData(message.data);
          await this.authorisationService.removeRequest(contractAddress, key);
          const sentTransaction = await this.wallet.sendTransaction(transaction);
          this.hooks.emit('added', sentTransaction);
          return sentTransaction;
        } else if (message.to === contractAddress && isAddKeysCall(message.data)) {
          const sentTransaction = await this.wallet.sendTransaction(transaction);
          this.hooks.emit('keysAdded', sentTransaction);
          return sentTransaction;
        }
        return await this.wallet.sendTransaction(transaction);
      }
    }
    throw new Error('Not enough tokens');
  }
}

export default IdentityService;

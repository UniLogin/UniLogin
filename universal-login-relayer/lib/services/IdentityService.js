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
    const args = [key, ...ensArgs];
    const deployTransaction = {
      value: utils.parseEther('0.1'),
      ...defaultDeployOptions,
      ...overrideOptions,
      ...ethers.Contract.getDeployTransaction(bytecode, this.abi, ...args)
    };
    const transaction = await this.wallet.sendTransaction(deployTransaction);
    this.hooks.emit('created', transaction);
    return transaction;
  }

  async executeSigned(contractAddress, message) {
    if (await hasEnoughToken(message.gasToken, contractAddress, message.gasLimit, this.provider)) {
      const {data} = new Interface(Identity.interface).functions.executeSigned(message.to, message.value, message.data, message.nonce, message.gasToken, message.gasPrice, message.gasLimit, message.signature);
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
          this.hooks.emit('added', contractAddress);
          return sentTransaction;
        } else if (message.to === contractAddress && isAddKeysCall(message.data)) {
          const sentTransaction = await this.wallet.sendTransaction(transaction);
          this.hooks.emit('keysAdded', contractAddress);
          return sentTransaction;
        }
        return await this.wallet.sendTransaction(transaction);
      }
    }
    throw new Error('Not enough tokens');
  }
}

export default IdentityService;

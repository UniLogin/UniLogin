import Identity from 'universal-login-contracts/build/Identity';
import {addressToBytes32, isEnoughGasLimit, hasEnoughToken} from '../utils/utils';
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
    const {data} = new Interface(Identity.interface).functions.executeSigned(message.to, message.value, message.data, message.nonce, message.gasToken, message.gasPrice, message.gasLimit, message.signature);
    const transaction = {
      value: 0,
      to: contractAddress,
      data,
      ...defaultDeployOptions
    };
    const estimateGas = await this.wallet.estimateGas(transaction);
    if (isEnoughGasLimit(estimateGas, message.gasLimit) && await hasEnoughToken(message.gasToken, contractAddress, message.gasLimit, this.provider)) {
      const addKeySighash = new Interface(Identity.interface).functions.addKey.sighash;
      if (message.to === contractAddress && message.data.slice(0, addKeySighash.length) === addKeySighash) {
        const [address] = (this.codec.decode(['bytes32', 'uint256', 'uint256'], message.data.replace(addKeySighash.slice(2), '')));
        const key = utils.hexlify(utils.stripZeros(address));
        await this.authorisationService.removeRequest(contractAddress, key);
        const sentTransaction = await this.wallet.sendTransaction(transaction);
        this.hooks.emit('added', key);
        return sentTransaction;
      }
      return await this.wallet.sendTransaction(transaction);
    }
  }
}

export default IdentityService;

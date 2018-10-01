import Identity from 'universal-login-contracts/build/Identity';
import {addressToBytes32} from '../utils/utils';
import ethers, {utils, Interface} from 'ethers';
import defaultDeployOptions from '../config/defaultDeployOptions';


class IdentityService {
  constructor(wallet, ensService, authorisationService, hooks) {
    this.wallet = wallet;
    this.abi = Identity.interface;
    this.ensService = ensService;
    this.authorisationService = authorisationService;
    this.codec = new utils.AbiCoder();
    this.hooks = hooks;
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
    const contract = new ethers.Contract(contractAddress, this.abi, this.wallet);
    const addKeySighash = new Interface(Identity.interface).functions.addKey.sighash;
    if (message.to === contractAddress && message.data.slice(0, addKeySighash.length) === addKeySighash) {
      const [address] = (this.codec.decode(['bytes32', 'uint256', 'uint256'], message.data.replace(addKeySighash.slice(2), '')));
      const key = utils.hexlify(utils.stripZeros(address));
      await this.authorisationService.removeRequest(contractAddress, key);
      const transaction = await contract.executeSigned(message.to, message.value, message.data, message.signature, message.gasToken, message.gasPrice, message.gasLimit);
      this.hooks.emit('added', key);
      return transaction;
    }
    return await contract.executeSigned(message.to, message.value, message.data, message.signature, message.gasToken, message.gasPrice, message.gasLimit);
  }
}

export default IdentityService;

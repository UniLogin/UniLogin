import Identity from '../../build/Identity';
import {addressToBytes32} from '../utils/utils';
import ethers, {utils} from 'ethers';
import defaultDeployOptions from '../config/defaultDeployOptions';


class IdentityService {
  constructor(wallet, ensService) {
    this.wallet = wallet;
    this.abi = Identity.interface;
    this.ensService = ensService;
  }

  async create(managementKey, ensName, overrideOptions = {}) {
    const key = addressToBytes32(managementKey);
    const bytecode = `0x${Identity.bytecode}`;
    const ensArgs = this.ensService.argsFor(ensName);
    const args = [key, ...ensArgs];
    const deployTransaction = {
      value: utils.parseEther('7'),
      ...defaultDeployOptions,
      ...overrideOptions,
      ...ethers.Contract.getDeployTransaction(bytecode, this.abi, ...args)
    };
    return this.wallet.sendTransaction(deployTransaction);
  }

  async executeSigned(contractAddress, message) {
    const contract = new ethers.Contract(contractAddress, this.abi, this.wallet);
    return await contract.executeSigned(message.to, message.value, message.data, message.signature);
  }
}

export default IdentityService;

import Identity from '../../../build/Identity';
import {addressToBytes32} from '../../utils/utils';
import ethers from 'ethers';

class IdentityService {
  constructor(wallet) {
    this.wallet = wallet;
    this.abi = Identity.interface;
  }

  async create(managementKey) {
    const overrideOptions = {gasLimit: 4000000};
    const key = addressToBytes32(managementKey);
    const bytecode = `0x${Identity.bytecode}`;
    const args = [key];
    const deployTransaction = {
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

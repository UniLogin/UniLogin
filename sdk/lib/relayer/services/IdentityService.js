import Identity from '../../../build/Identity';
import {addressToBytes32} from '../../utils/utils';
import ethers from 'ethers';

class IdentityService {
  constructor(wallet) {
    this.wallet = wallet;
  }

  async create(managementKey) {
    const key = addressToBytes32(managementKey);
    const bytecode = `0x${Identity.bytecode}`;
    const abi = Identity.interface;
    const args = [key, 1];
    const deployTransaction = ethers.Contract.getDeployTransaction(bytecode, abi, ...args);
    return this.wallet.sendTransaction(deployTransaction);
  }

  execute() {
    return {result: 'ok'};
  }
}

export default IdentityService;

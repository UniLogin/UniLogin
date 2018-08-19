import Identity from '../../../build/Identity';
import addressToBytes32 from '../../utils/utils';
import {deployContract} from 'ethereum-waffle';


class IdentityService {
  constructor(wallet) {
    this.wallet = wallet;
  }

  async create(managementKey) {
    const key = addressToBytes32(managementKey);
    const identityContract = await deployContract(this.wallet, Identity, [key, 1]);
    return identityContract.address;
  }

  execute() {
    return {result: 'ok'};
  }
}

export default IdentityService;

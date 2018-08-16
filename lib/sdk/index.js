const MANAGEMENT_KEY = 1;
const ACTION_KEY = 2;
const ECDSA_TYPE = 1;

class EthereumIdentitySDK {
  create() {
    return 'done';
  }

  addKey() {
    throw 'not yet implemented';
  }

  removeKey() {
    throw 'not yet implemented';
  }
}

export default EthereumIdentitySDK;
export {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE};

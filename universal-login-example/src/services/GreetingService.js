import KeyHolder from 'universal-login-contracts/build/KeyHolder';
import {fetchEventsOfType} from '../utils';

class GreetingService {
  constructor(provider, keyHolderAddress) {
    this.provider = provider;
    this.keyHolderAddress = keyHolderAddress;
  }

  async getKeyEventsCounts(keyHolderAddress) {
    const single = await fetchEventsOfType(this.provider, KeyHolder.interface, keyHolderAddress, 'KeyAdded');
    const multiple = await fetchEventsOfType(this.provider, KeyHolder.interface, keyHolderAddress, 'MultipleKeysAdded');
    const accumulatedMultipleKeys = multiple.reduce((accum, event) => accum + event.values.count.toNumber(), 0);
    return {
      addKey: single.length - accumulatedMultipleKeys - 1,
      backupKeys: multiple.length
    };
  }

  async getAddKeyStatus(addKey, eventName) {
    if (eventName === 'addKey') {
      return 'fresh';
    }
    return addKey > 0 ? 'old' : 'unfinished';
  }

  async getBackupKeysStatus(backupKeys, eventName) {
    if (eventName === 'backupKeys') {
      return 'fresh';
    }
    return backupKeys > 0 ? 'old' : 'unfinished';
  }

  async getStatus(keyHolderAddress, eventName) {
    const {addKey, backupKeys} = await this.getKeyEventsCounts(keyHolderAddress);
    return {
      create: eventName === 'created' ? 'fresh' : 'old',
      addKey: await this.getAddKeyStatus(addKey, eventName),
      backupKeys: await this.getBackupKeysStatus(backupKeys, eventName)
    };
  }
}

export default GreetingService;

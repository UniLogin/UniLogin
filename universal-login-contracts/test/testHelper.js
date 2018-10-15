import {createMockProvider, getWallets} from 'ethereum-waffle';
import {promisify} from 'util';

class TestHelper {
  constructor(provider = createMockProvider()) {
    this.provider = provider;
    this.snapshots = {};
    this.fixtures = {};
  }

  async snapshot() {
    /* eslint-disable-next-line no-underscore-dangle */
    const sendAsync = promisify(this.provider._web3Provider.sendAsync);
    return sendAsync({method: 'evm_snapshot'});
  }

  async restore(snapshotId) {
    /* eslint-disable-next-line no-underscore-dangle */
    const sendAsync = promisify(this.provider._web3Provider.sendAsync);
    const payload = {method: 'evm_revert', params: [snapshotId]};
    return sendAsync(payload);
  }

  async lazyLoadDeployer() {
    if (!this.deployer) {
      [,,,,,,,,,this.deployer] = await getWallets(this.provider);
    }
  }

  async load(fixtureFunction) {
    const {name} = fixtureFunction;
    if (this.snapshots[name]) {
      await this.restore(this.snapshots[name]);
      await this.snapshot();
      return this.fixtures[name];
    }
    await this.lazyLoadDeployer();
    const fixture = await fixtureFunction(this.provider, this.deployer);
    const {result} = await this.snapshot();
    this.snapshots[name] = result;
    this.fixtures[name] = {provider: this.provider, ...fixture};
    return this.fixtures[name];
  }
}

export default TestHelper;

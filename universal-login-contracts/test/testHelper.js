/**
 * READER BEWARE!!!
 * 
 * This file is directly required in other projects. It has to follow commonjs
 * convention to avoid compilation errors.
 * 
 * Moreover THIS FILE IS NOT REALLY NEEDED. Since waffle v2 fixtures are built
 * into the library!
 */
const {createMockProvider, getWallets} = require('ethereum-waffle');
const {promisify} = require('util');

class TestHelper {
  constructor(provider = createMockProvider()) {
    this.provider = provider;
    this.snapshots = {};
    this.fixtures = {};
  }

  async snapshot() {
    const sendAsync = promisify(this.provider._web3Provider.sendAsync);
    return sendAsync({method: 'evm_snapshot'});
  }

  async restore(snapshotId) {
    const sendAsync = promisify(this.provider._web3Provider.sendAsync);
    const payload = {method: 'evm_revert', params: [snapshotId]};
    return sendAsync(payload);
  }

  async lazyLoadDeployer() {
    if (!this.deployer) {
      [, , , , , , , , , this.deployer] = await getWallets(this.provider);
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
    const fixture = await fixtureFunction(this.deployer);
    const {result} = await this.snapshot();
    this.snapshots[name] = result;
    this.fixtures[name] = Object.assign({provider: this.provider}, fixture)
    return this.fixtures[name];
  }
}

module.exports = TestHelper;
